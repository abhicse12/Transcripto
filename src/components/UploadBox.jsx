import { useRef, useState } from "react"

import {
  MAX_FILE_SIZE,
  getErrorMessage,
  transcribeAudio,
} from "../api/transcripts"

import TranscriptResult from "./TranscriptResult"

import { useAuth } from "@clerk/clerk-react"

import { FileAudio, Loader2, Upload, X } from "lucide-react"

const formatSize = (bytes) =>
  `${(bytes / (1024 * 1024)).toFixed(1)} MB`

function UploadBox() {

  const [audioFile, setAudioFile] = useState(null)

  const [loading, setLoading] = useState(false)

  const [transcript, setTranscript] = useState("")

  const [error, setError] = useState("")

  const inputRef = useRef(null)

  const { getToken } = useAuth()

  // HANDLE FILE
  const handleFileChange = (e) => {

    const file = e.target.files[0] || null

    setAudioFile(file)

    setTranscript("")

    setError(
      file && file.size > MAX_FILE_SIZE
        ? "File is too large. Maximum size is 100 MB."
        : ""
    )
  }

  // REMOVE FILE
  const handleRemove = () => {

    inputRef.current.value = ""

    setAudioFile(null)

    setTranscript("")

    setError("")
  }

  // HANDLE UPLOAD
  const handleUpload = async () => {

    try {

      setLoading(true)

      setTranscript("")

      setError("")

      setTranscript(
        await transcribeAudio(getToken, audioFile)
      )

    } catch (error) {

      console.log(error)

      setError(
        getErrorMessage(error, error.response ? "Failed to generate transcription" : error.message)
      )

    } finally {

      setLoading(false)
    }
  }

  return (

    <section className="card p-5 sm:p-6">

      <div className="flex items-center gap-3">

        <div className="icon-tile bg-violet-500/15 text-violet-300">
          <Upload className="size-5" aria-hidden="true" />
        </div>

        <div>

          <h2 className="text-lg font-semibold">
            Upload a file
          </h2>

          <p className="text-sm text-zinc-400">
            MP3, WAV, WEBM, M4A, AAC, OGG or FLAC, up to 100 MB.
          </p>

        </div>

      </div>

      {/* FILE PICKER */}
      <input
        ref={inputRef}
        id="audio-file"
        type="file"
        accept="audio/*,.webm"
        onChange={handleFileChange}
        disabled={loading}
        className="sr-only"
      />

      {
        audioFile ? (

          <div className="mt-5 flex items-center gap-3 rounded-lg border border-zinc-800 bg-zinc-950 p-4">

            <FileAudio className="size-5 shrink-0 text-violet-300" aria-hidden="true" />

            <div className="min-w-0 flex-1">

              <p className="truncate text-sm font-medium">
                {audioFile.name}
              </p>

              <p className="text-sm text-zinc-500">
                {formatSize(audioFile.size)}
              </p>

            </div>

            <button
              onClick={handleRemove}
              disabled={loading}
              aria-label="Remove file"
              className="btn btn-ghost btn-delete p-2"
            >
              <X className="size-4" aria-hidden="true" />
            </button>

          </div>

        ) : (

          <label
            htmlFor="audio-file"
            className="mt-5 flex cursor-pointer flex-col items-center gap-2 rounded-xl border border-dashed border-violet-400/40 bg-violet-500/5 px-4 py-10 text-center transition-colors hover:border-violet-400 hover:bg-violet-500/10"
          >

            <FileAudio className="size-7 text-violet-300" aria-hidden="true" />

            <span className="text-sm font-medium">
              Choose an audio file
            </span>

          </label>
        )
      }

      {/* BUTTON */}
      <button
        onClick={handleUpload}
        disabled={!audioFile || loading || audioFile.size > MAX_FILE_SIZE}
        className="btn btn-primary mt-4 w-full"
      >

        {loading && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}

        {loading ? "Transcribing..." : "Generate transcript"}

      </button>

      {/* ERROR */}
      {
        error && (
          <p className="alert-error mt-4">
            {error}
          </p>
        )
      }

      {/* TRANSCRIPT */}
      {transcript && <TranscriptResult text={transcript} />}

    </section>
  )
}

export default UploadBox
