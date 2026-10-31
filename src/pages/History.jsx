import { useEffect, useState } from "react"

import {
  deleteTranscript,
  fetchTranscript,
  fetchTranscripts,
  getErrorMessage,
} from "../api/transcripts"

import { useAuth } from "@clerk/clerk-react"

const SEARCH_DELAY = 400

const POLL_INTERVAL = 5000

const STATUS_BADGES = {
  completed: {
    label: "AI Transcript",
    className: "bg-green-500/10 text-green-400 border-green-500/20",
  },
  processing: {
    label: "Processing",
    className: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  },
  failed: {
    label: "Failed",
    className: "bg-red-500/10 text-red-400 border-red-500/20",
  },
}

function History() {

  const [transcripts, setTranscripts] = useState([])

  const [loading, setLoading] = useState(true)

  const [loadingMore, setLoadingMore] = useState(false)

  const [hasMore, setHasMore] = useState(false)

  const [page, setPage] = useState(1)

  const [error, setError] = useState("")

  const [search, setSearch] = useState("")

  const [activeSearch, setActiveSearch] = useState("")

  const [retryCount, setRetryCount] = useState(0)

  const { getToken } = useAuth()

  // RELOAD FROM FIRST PAGE
  const reload = (nextSearch) => {

    setLoading(true)

    setError("")

    setPage(1)

    setActiveSearch(nextSearch)

    setRetryCount((count) => count + 1)
  }

  // LOAD NEXT PAGE
  const handleLoadMore = async () => {

    try {

      setLoadingMore(true)

      const nextPage = page + 1

      const data = await fetchTranscripts(getToken, {
        page: nextPage,
        search: activeSearch,
      })

      // New uploads shift pages, so skip anything already listed
      setTranscripts((current) => [
        ...current,
        ...data.transcripts.filter(
          (item) => !current.some((existing) => existing._id === item._id)
        ),
      ])

      setPage(nextPage)

      setHasMore(data.hasMore)

    } catch (error) {

      console.log(error)

      alert(getErrorMessage(error, "Failed to load more transcripts"))

    } finally {

      setLoadingMore(false)
    }
  }

  // DELETE
  const handleDelete = async (id) => {

    if (!window.confirm("Delete this transcript? This cannot be undone.")) {
      return
    }

    try {

      await deleteTranscript(getToken, id)

      setTranscripts((current) =>
        current.filter((item) => item._id !== id)
      )

    } catch (error) {

      console.log(error)

      alert(getErrorMessage(error, "Failed to delete transcript"))
    }
  }

  // COPY
  const handleCopy = async (text) => {

    try {

      await navigator.clipboard.writeText(text)

      alert("Transcript copied")

    } catch (error) {

      console.log(error)

      alert("Could not copy transcript")
    }
  }

  // SEARCH
  useEffect(() => {

    if (search === activeSearch) {
      return
    }

    const timer = setTimeout(() => reload(search), SEARCH_DELAY)

    return () => clearTimeout(timer)

  }, [search, activeSearch])

  // FETCH ON LOAD AND ON SEARCH
  useEffect(() => {

    let ignore = false

    fetchTranscripts(getToken, { search: activeSearch })
      .then((data) => {

        if (ignore) return

        setTranscripts(data.transcripts)

        setHasMore(data.hasMore)

        setLoading(false)
      })
      .catch((error) => {

        console.log(error)

        if (ignore) return

        setError(getErrorMessage(error, "Failed to load transcripts"))

        setLoading(false)
      })

    return () => {
      ignore = true
    }

  }, [getToken, activeSearch, retryCount])

  const processingIds = transcripts
    .filter((item) => item.status === "processing")
    .map((item) => item._id)
    .join(",")

  // REFRESH TRANSCRIPTS THAT ARE STILL PROCESSING
  useEffect(() => {

    if (!processingIds) {
      return
    }

    const timer = setInterval(async () => {

      try {

        const updates = await Promise.all(
          processingIds.split(",").map((id) =>
            fetchTranscript(getToken, id)
          )
        )

        setTranscripts((current) =>
          current.map((item) =>
            updates.find((update) => update._id === item._id) || item
          )
        )

      } catch (error) {

        console.log(error)
      }

    }, POLL_INTERVAL)

    return () => clearInterval(timer)

  }, [getToken, processingIds])

  return (

    <div className="
      min-h-screen
      bg-black
      text-white
      relative
      overflow-hidden
    ">

      {/* BACKGROUND GLOW */}
      <div className="absolute inset-0 -z-10">

        <div className="
          absolute
          top-0
          left-1/3
          w-96
          h-96
          bg-purple-500/20
          blur-3xl
          rounded-full
        " />

        <div className="
          absolute
          bottom-0
          right-1/3
          w-96
          h-96
          bg-blue-500/20
          blur-3xl
          rounded-full
        " />

      </div>

      {/* HEADER */}
      <div className="
        max-w-7xl
        mx-auto
        px-4
        sm:px-6
        pt-12
        sm:pt-20
        pb-10
      ">

        <div className="
          flex
          flex-col
          md:flex-row
          md:items-center
          md:justify-between
          gap-6
        ">

          <div>

            <h1 className="
              text-5xl
              md:text-6xl
              font-black
              mb-4
            ">

              Your

              <span className="
                bg-gradient-to-r
                from-purple-400
                to-blue-400
                bg-clip-text
                text-transparent
              ">
                {" "}Transcripts
              </span>

            </h1>

            <p className="
              text-zinc-400
              text-lg
            ">
              Manage and search all your AI-generated transcriptions.
            </p>

          </div>

          {/* SEARCH */}
          <div className="w-full md:w-[400px]">

            <input
              type="text"
              placeholder="Search transcripts..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="
                w-full
                bg-zinc-900/60
                backdrop-blur-xl
                border
                border-zinc-800
                rounded-2xl
                px-6
                py-4
                outline-none
                focus:border-purple-500/40
                text-white
                placeholder:text-zinc-500
              "
            />

          </div>

        </div>

      </div>

      {/* LOADING */}
      {
        loading && (

          <div className="
            text-center
            text-zinc-400
            text-xl
            mt-20
            animate-pulse
          ">
            Loading transcripts...
          </div>
        )
      }

      {/* ERROR */}
      {
        !loading && error && (

          <div className="
            text-center
            mt-24
            px-4
          ">

            <p className="
              text-red-400
              text-lg
              mb-6
            ">
              {error}
            </p>

            <button
              onClick={() => reload(activeSearch)}
              className="
                bg-white
                text-black
                px-6
                py-3
                rounded-2xl
                font-semibold
              "
            >
              Try Again
            </button>

          </div>
        )
      }

      {/* EMPTY STATE */}
      {
        !loading &&
        !error &&
        transcripts.length === 0 && (

          <div className="
            text-center
            mt-24
            px-6
          ">

            <div className="
              text-7xl
              mb-6
            ">
              📂
            </div>

            <h2 className="
              text-3xl
              font-bold
              mb-4
            ">
              No Transcripts Found
            </h2>

            <p className="
              text-zinc-500
              text-lg
            ">
              {
                activeSearch
                  ? "Try a different search."
                  : "Upload or record audio to generate transcripts."
              }
            </p>

          </div>
        )
      }

      {/* TRANSCRIPTS GRID */}
      <div className="
        max-w-7xl
        mx-auto
        px-4
        sm:px-6
        pb-24
        grid
        gap-8
      ">

        {
          !loading && !error && transcripts.map((item) => (

            <div
              key={item._id}
              className="
                bg-zinc-900/60
                backdrop-blur-xl
                border
                border-zinc-800
                rounded-[28px]
                p-5
                sm:p-8
                hover:border-purple-500/30
                hover:-translate-y-1
                transition
                duration-300
              "
            >

              {/* TOP */}
              <div className="
                flex
                flex-col
                md:flex-row
                md:items-start
                md:justify-between
                gap-5
                mb-8
              ">

                <div>

                  <div className={`
                    inline-flex
                    items-center
                    gap-2
                    border
                    px-4
                    py-2
                    rounded-full
                    text-sm
                    mb-4
                    ${STATUS_BADGES[item.status].className}
                  `}>

                    <span>●</span>

                    {STATUS_BADGES[item.status].label}

                  </div>

                  <h2 className="
                    text-2xl
                    font-bold
                    break-all
                  ">
                    {item.fileName}
                  </h2>

                  <p className="
                    text-zinc-500
                    mt-3
                  ">
                    {
                      new Date(item.createdAt)
                        .toLocaleString()
                    }
                  </p>

                </div>

                {/* ACTIONS */}
                <div className="
                  flex
                  gap-3
                ">

                  <button
                    onClick={() =>
                      handleCopy(item.transcriptText)
                    }
                    disabled={!item.transcriptText}
                    className="
                      bg-blue-500/10
                      text-blue-400
                      border
                      border-blue-500/20
                      px-5
                      py-3
                      rounded-2xl
                      hover:bg-blue-500/20
                      transition
                      disabled:opacity-50
                      disabled:cursor-not-allowed
                    "
                  >
                    Copy
                  </button>

                  <button
                    onClick={() =>
                      handleDelete(item._id)
                    }
                    disabled={item.status === "processing"}
                    className="
                      bg-red-500/10
                      text-red-400
                      border
                      border-red-500/20
                      px-5
                      py-3
                      rounded-2xl
                      hover:bg-red-500/20
                      transition
                      disabled:opacity-50
                      disabled:cursor-not-allowed
                    "
                  >
                    Delete
                  </button>

                </div>

              </div>

              {/* TRANSCRIPT TEXT */}
              <div className="
                bg-black/40
                border
                border-zinc-800
                rounded-3xl
                p-4
                sm:p-6
              ">

                <p className="
                  text-zinc-300
                  leading-9
                  whitespace-pre-wrap
                  break-words
                ">
                  {
                    item.transcriptText ||
                    item.errorMessage ||
                    (item.status === "processing"
                      ? "AI is generating transcription..."
                      : "No speech was detected in this audio.")
                  }
                </p>

              </div>

            </div>
          ))
        }

        {/* LOAD MORE */}
        {
          !loading && !error && hasMore && (

            <div className="text-center">

              <button
                onClick={handleLoadMore}
                disabled={loadingMore}
                className="
                  bg-white
                  text-black
                  px-6
                  py-3
                  rounded-2xl
                  font-semibold
                  disabled:opacity-50
                  disabled:cursor-not-allowed
                "
              >
                {loadingMore ? "Loading..." : "Load More"}
              </button>

            </div>
          )
        }

      </div>

    </div>
  )
}

export default History