import { useEffect, useState } from "react"

import API from "../api/axios"

import { useUser } from "@clerk/clerk-react"

function History() {

  const [transcripts, setTranscripts] = useState([])

  const [filteredTranscripts, setFilteredTranscripts] = useState([])

  const [loading, setLoading] = useState(true)

  const [search, setSearch] = useState("")

  const { user } = useUser()

  // FETCH TRANSCRIPTS
  const fetchTranscripts = async () => {

    try {

      const response = await API.get(

        `/transcript?userId=${user.id}`
      )

      setTranscripts(response.data.transcripts)

      setFilteredTranscripts(
        response.data.transcripts
      )

    } catch (error) {

      console.log(error)

    } finally {

      setLoading(false)
    }
  }

  // DELETE
  const handleDelete = async (id) => {

    try {

      await API.delete(`/transcript/${id}`)

      const updated = transcripts.filter(
        (item) => item._id !== id
      )

      setTranscripts(updated)

      setFilteredTranscripts(updated)

    } catch (error) {

      console.log(error)
    }
  }

  // COPY
  const handleCopy = async (text) => {

    try {

      await navigator.clipboard.writeText(text)

      alert("Transcript copied")

    } catch (error) {

      console.log(error)
    }
  }

  // SEARCH
  useEffect(() => {

    const filtered = transcripts.filter((item) =>

      item.transcriptText
        .toLowerCase()
        .includes(search.toLowerCase())
    )

    setFilteredTranscripts(filtered)

  }, [search, transcripts])

  // FETCH ON LOAD
  useEffect(() => {

    if (user) {
      fetchTranscripts()
    }

  }, [user])

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
        px-6
        pt-20
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

      {/* EMPTY STATE */}
      {
        !loading &&
        filteredTranscripts.length === 0 && (

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
              Upload or record audio to generate transcripts.
            </p>

          </div>
        )
      }

      {/* TRANSCRIPTS GRID */}
      <div className="
        max-w-7xl
        mx-auto
        px-6
        pb-24
        grid
        gap-8
      ">

        {
          filteredTranscripts.map((item) => (

            <div
              key={item._id}
              className="
                bg-zinc-900/60
                backdrop-blur-xl
                border
                border-zinc-800
                rounded-[28px]
                p-8
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

                  <div className="
                    inline-flex
                    items-center
                    gap-2
                    bg-green-500/10
                    text-green-400
                    border
                    border-green-500/20
                    px-4
                    py-2
                    rounded-full
                    text-sm
                    mb-4
                  ">

                    <span>●</span>

                    AI Transcript

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
                    "
                  >
                    Copy
                  </button>

                  <button
                    onClick={() =>
                      handleDelete(item._id)
                    }
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
                p-6
              ">

                <p className="
                  text-zinc-300
                  leading-9
                  whitespace-pre-wrap
                ">
                  {item.transcriptText}
                </p>

              </div>

            </div>
          ))
        }

      </div>

    </div>
  )
}

export default History