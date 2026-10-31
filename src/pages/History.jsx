import { useEffect, useState } from "react"

import {
  deleteTranscript,
  fetchTranscript,
  fetchTranscripts,
  getErrorMessage,
} from "../api/transcripts"

import CopyButton from "../components/CopyButton"

import { useAuth } from "@clerk/clerk-react"

import { FileText, Loader2, Search, Trash2 } from "lucide-react"

const SEARCH_DELAY = 400

const POLL_INTERVAL = 5000

const LONG_TEXT = 400

const STATUS_BADGES = {
  processing: {
    label: "Processing",
    className: "border-blue-900 bg-blue-950/50 text-blue-300",
  },
  failed: {
    label: "Failed",
    className: "border-red-900 bg-red-950/50 text-red-300",
  },
}

function HistoryItem({ item, onDelete }) {

  const [expanded, setExpanded] = useState(false)

  const badge = STATUS_BADGES[item.status]

  const isLong = item.transcriptText?.length > LONG_TEXT

  return (

    <article className="card p-5 transition hover:border-violet-400/40">

      {/* TOP */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

        <div className="min-w-0">

          <div className="flex flex-wrap items-center gap-2">

            <h2 className="font-medium break-all">
              {item.fileName}
            </h2>

            {
              badge && (
                <span className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${badge.className}`}>
                  {badge.label}
                </span>
              )
            }

          </div>

          <p className="mt-1 text-sm text-zinc-500">
            {new Date(item.createdAt).toLocaleString()}
          </p>

        </div>

        {/* ACTIONS */}
        <div className="flex shrink-0 gap-2">

          <CopyButton text={item.transcriptText} />

          <button
            onClick={() => onDelete(item._id)}
            disabled={item.status === "processing"}
            className="btn btn-secondary btn-delete"
          >
            <Trash2 className="size-4" aria-hidden="true" />
            Delete
          </button>

        </div>

      </div>

      {/* TRANSCRIPT TEXT */}
      <p className={`
        mt-4
        text-sm
        leading-7
        break-words
        whitespace-pre-wrap
        text-zinc-300
        ${isLong && !expanded ? "line-clamp-4" : ""}
      `}>
        {
          item.transcriptText ||
          item.errorMessage ||
          (item.status === "processing"
            ? "Transcribing this audio..."
            : "No speech was detected in this audio.")
        }
      </p>

      {
        isLong && (

          <button
            onClick={() => setExpanded(!expanded)}
            className="mt-2 cursor-pointer text-sm font-medium text-violet-300 underline-offset-4 transition-colors duration-300 hover:text-fuchsia-300 hover:underline"
          >
            {expanded ? "Show less" : "Show more"}
          </button>
        )
      }

    </article>
  )
}

function History() {

  const [transcripts, setTranscripts] = useState([])

  const [total, setTotal] = useState(0)

  const [loading, setLoading] = useState(true)

  const [loadingMore, setLoadingMore] = useState(false)

  const [hasMore, setHasMore] = useState(false)

  const [page, setPage] = useState(1)

  const [error, setError] = useState("")

  const [actionError, setActionError] = useState("")

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

      setActionError("")

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

      setActionError(getErrorMessage(error, "Failed to load more transcripts"))

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

      setActionError("")

      await deleteTranscript(getToken, id)

      setTranscripts((current) =>
        current.filter((item) => item._id !== id)
      )

      setTotal((current) => current - 1)

    } catch (error) {

      console.log(error)

      setActionError(getErrorMessage(error, "Failed to delete transcript"))
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

        setTotal(data.total)

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

  const showList = !loading && !error

  return (

    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">

      {/* HEADER */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

        <div>

          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Your <span className="text-gradient">words, saved</span>
          </h1>

          <p className="mt-2 text-zinc-400">
            {
              showList
                ? `${total} ${total === 1 ? "transcript" : "transcripts"}${activeSearch ? " found" : ""}`
                : "Your saved transcripts"
            }
          </p>

        </div>

        {/* SEARCH */}
        <div className="relative w-full sm:w-72">

          <Search
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-zinc-500"
            aria-hidden="true"
          />

          <input
            type="search"
            placeholder="Search transcripts"
            aria-label="Search transcripts"
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="w-full rounded-lg border border-white/10 bg-zinc-900/60 py-2.5 pr-3 pl-9 text-sm outline-none placeholder:text-zinc-500 focus:border-violet-400"
          />

        </div>

      </div>

      {
        actionError && (
          <p className="alert-error mt-6">
            {actionError}
          </p>
        )
      }

      {/* LOADING */}
      {
        loading && (

          <div className="mt-20 flex items-center justify-center gap-2 text-sm text-zinc-400">
            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            Loading transcripts
          </div>
        )
      }

      {/* ERROR */}
      {
        !loading && error && (

          <div className="mt-20 text-center">

            <p className="mb-4 text-sm text-red-300">
              {error}
            </p>

            <button
              onClick={() => reload(activeSearch)}
              className="btn btn-secondary"
            >
              Try again
            </button>

          </div>
        )
      }

      {/* EMPTY STATE */}
      {
        showList && transcripts.length === 0 && (

          <div className="mt-20 text-center">

            <FileText className="mx-auto size-8 text-violet-300" aria-hidden="true" />

            <h2 className="mt-4 font-medium">
              No transcripts found
            </h2>

            <p className="mt-1 text-sm text-zinc-500">
              {
                activeSearch
                  ? "Try a different search."
                  : "Upload or record audio to create your first transcript."
              }
            </p>

          </div>
        )
      }

      {/* TRANSCRIPTS */}
      {
        showList && transcripts.length > 0 && (

          <div className="mt-8 grid gap-4">

            {
              transcripts.map((item) => (
                <HistoryItem
                  key={item._id}
                  item={item}
                  onDelete={handleDelete}
                />
              ))
            }

          </div>
        )
      }

      {/* LOAD MORE */}
      {
        showList && hasMore && (

          <div className="mt-6 text-center">

            <button
              onClick={handleLoadMore}
              disabled={loadingMore}
              className="btn btn-secondary"
            >
              {loadingMore ? "Loading..." : "Load more"}
            </button>

          </div>
        )
      }

    </div>
  )
}

export default History
