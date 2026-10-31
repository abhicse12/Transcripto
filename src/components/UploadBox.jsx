import { useState } from "react"

import {
  MAX_FILE_SIZE,
  getErrorMessage,
  transcribeAudio,
} from "../api/transcripts"

import { useAuth } from "@clerk/clerk-react"

function UploadBox() {

  const [audioFile, setAudioFile] = useState(null)

  const [loading, setLoading] = useState(false)

  const [transcript, setTranscript] = useState("")

  const [error, setError] = useState("")

  const { getToken } = useAuth()

  // HANDLE FILE
  const handleFileChange = (e) => {

    setAudioFile(e.target.files[0] || null)

    setError("")
  }

  // HANDLE UPLOAD
  const handleUpload = async () => {

    if (!audioFile) {
      return alert("Please select audio file")
    }

    if (audioFile.size > MAX_FILE_SIZE) {
      return setError("File is too large. Maximum size is 100 MB.")
    }

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

  // COPY TRANSCRIPT
  const handleCopy = async () => {

    try {

      await navigator.clipboard.writeText(
        transcript
      )

      alert("Transcript copied")

    } catch (error) {

      console.log(error)

      alert("Could not copy transcript")
    }
  }

  return (

    <div className="
      max-w-5xl
      mx-auto
      bg-zinc-900/60
      backdrop-blur-xl
      border
      border-zinc-800
      rounded-[32px]
      p-5
      md:p-12
      shadow-2xl
    ">

      {/* HEADER */}
      <div className="text-center mb-12">

        <h2 className="
          text-4xl
          md:text-5xl
          font-black
          mb-5
        ">

          Upload Audio For

          <span className="
            bg-gradient-to-r
            from-purple-400
            to-blue-400
            bg-clip-text
            text-transparent
          ">
            {" "}AI Transcription
          </span>

        </h2>

        <p className="
          text-zinc-400
          text-lg
          max-w-2xl
          mx-auto
          leading-8
        ">

          Upload MP3, WAV, WEBM, M4A, AAC, OGG or FLAC audio
          files up to 100 MB and generate AI-powered transcriptions.

        </p>

      </div>

      {/* UPLOAD AREA */}
      <div className="
        border-2
        border-dashed
        border-zinc-700
        rounded-3xl
        p-5
        sm:p-10
        text-center
        bg-black/30
        hover:border-purple-500/40
        transition
      ">

        <input
          type="file"
          accept="audio/*,.webm"
          onChange={handleFileChange}
          className="
            block
            w-full
            text-zinc-400
            file:mr-4
            file:py-3
            file:px-6
            file:rounded-xl
            file:border-0
            file:bg-white
            file:text-black
            file:font-semibold
            hover:file:scale-105
            file:transition
            cursor-pointer
          "
        />

        {
          audioFile && (

            <div className="
              mt-6
              bg-zinc-900
              border
              border-zinc-800
              rounded-2xl
              p-5
            ">

              <p className="text-green-400 font-medium">
                Selected File
              </p>

              <p className="text-zinc-300 mt-2 break-all">
                {audioFile.name}
              </p>

            </div>
          )
        }

      </div>

      {/* BUTTON */}
      <div className="flex justify-center mt-10">

        <button
          onClick={handleUpload}
          disabled={loading}
          className="
            bg-white
            text-black
            px-10
            py-4
            rounded-2xl
            font-bold
            text-lg
            hover:scale-105
            transition
            disabled:opacity-50
            disabled:cursor-not-allowed
            shadow-xl
          "
        >

          {
            loading
              ? "Generating..."
              : "Generate Transcript"
          }

        </button>

      </div>

      {/* LOADING */}
      {
        loading && (

          <div className="mt-8 text-center">

            <p className="
              text-blue-400
              text-lg
              animate-pulse
            ">
              AI is generating transcription...
            </p>

          </div>
        )
      }

      {/* ERROR */}
      {
        error && (

          <div className="
            mt-8
            bg-red-500/10
            border
            border-red-500/20
            rounded-2xl
            p-5
          ">

            <p className="text-red-400">
              {error}
            </p>

          </div>
        )
      }

      {/* TRANSCRIPT */}
      {
        transcript && (

          <div className="
            mt-10
            bg-black/40
            border
            border-zinc-800
            rounded-3xl
            p-8
          ">

            <div className="
              flex
              flex-col
              md:flex-row
              md:items-center
              md:justify-between
              gap-4
              mb-6
            ">

              <div>

                <h3 className="
                  text-3xl
                  font-black
                ">
                  AI Transcription
                </h3>

                <p className="text-zinc-500 mt-2">
                  Generated successfully
                </p>

              </div>

              <button
                onClick={handleCopy}
                className="
                  bg-blue-500/10
                  text-blue-400
                  border
                  border-blue-500/20
                  px-6
                  py-3
                  rounded-2xl
                  hover:bg-blue-500/20
                  transition
                "
              >
                Copy Transcript
              </button>

            </div>

            <div className="
              bg-zinc-950
              border
              border-zinc-800
              rounded-2xl
              p-6
            ">

              <p className="
                text-zinc-300
                leading-9
                whitespace-pre-wrap
              ">
                {transcript}
              </p>

            </div>

          </div>
        )
      }

    </div>
  )
}

export default UploadBox