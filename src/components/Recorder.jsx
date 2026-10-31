import { useRef, useState, useEffect } from "react"

import {
  getErrorMessage,
  transcribeAudio,
} from "../api/transcripts"

import TranscriptResult from "./TranscriptResult"

import { useAuth } from "@clerk/clerk-react"

import { Loader2, Mic, RotateCcw, Square, Trash2 } from "lucide-react"

const MIC_ERRORS = {
  NotAllowedError: "Microphone access denied",
  NotFoundError: "No microphone found",
  NotReadableError: "Microphone is being used by another app",
}

function Recorder() {

  const [isRecording, setIsRecording] = useState(false)

  const [audioURL, setAudioURL] = useState("")

  const [transcript, setTranscript] = useState("")

  const [loading, setLoading] = useState(false)

  const [recordingTime, setRecordingTime] = useState(0)

  const [error, setError] = useState("")

  const mediaRecorderRef = useRef(null)

  const audioChunksRef = useRef([])

  const timerRef = useRef(null)

  const streamRef = useRef(null)

  const audioURLRef = useRef("")

  const { getToken } = useAuth()

  // RELEASE MIC AND AUDIO ON LEAVE
  useEffect(() => {

    return () => {

      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.onstop = null
      }

      streamRef.current?.getTracks().forEach((track) => track.stop())

      if (audioURLRef.current) {
        URL.revokeObjectURL(audioURLRef.current)
      }
    }

  }, [])

  // TIMER
  useEffect(() => {

    if (isRecording) {

      timerRef.current = setInterval(() => {

        setRecordingTime((prev) => prev + 1)

      }, 1000)

    } else {

      clearInterval(timerRef.current)
    }

    return () => clearInterval(timerRef.current)

  }, [isRecording])

  // FORMAT TIMER
  const formatTime = (time) => {

    const minutes = Math.floor(time / 60)

    const seconds = time % 60

    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`
  }

  // RESET, ALSO DISCARDS A RECORDING IN PROGRESS
  const resetRecording = () => {

    const mediaRecorder = mediaRecorderRef.current

    if (mediaRecorder) {

      // Without onstop the discarded audio is never uploaded
      mediaRecorder.onstop = null

      if (mediaRecorder.state !== "inactive") {
        mediaRecorder.stop()
      }
    }

    streamRef.current?.getTracks().forEach((track) => track.stop())

    if (audioURLRef.current) {
      URL.revokeObjectURL(audioURLRef.current)
    }

    audioURLRef.current = ""

    audioChunksRef.current = []

    setIsRecording(false)

    setAudioURL("")

    setTranscript("")

    setRecordingTime(0)

    setError("")
  }

  // START RECORDING
  const startRecording = async () => {

    try {

      resetRecording()

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      })

      streamRef.current = stream

      const mediaRecorder = new MediaRecorder(stream)

      mediaRecorderRef.current = mediaRecorder

      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {

        audioChunksRef.current.push(event.data)
      }

      // ON STOP
      mediaRecorder.onstop = async () => {

        // Browsers record different formats, Safari uses MP4
        const audioType =
          mediaRecorder.mimeType.split(";")[0] || "audio/webm"

        const audioBlob = new Blob(

          audioChunksRef.current,

          {
            type: audioType,
          }
        )

        if (audioURLRef.current) {
          URL.revokeObjectURL(audioURLRef.current)
        }

        const audioUrl = URL.createObjectURL(audioBlob)

        audioURLRef.current = audioUrl

        setAudioURL(audioUrl)

        const audioFile = new File(

          [audioBlob],

          audioType.includes("mp4") ? "recording.m4a" : "recording.webm",

          {
            type: audioType,
          }
        )

        try {

          setLoading(true)

          setTranscript(
            await transcribeAudio(getToken, audioFile)
          )

        } catch (error) {

          console.log(error)

          setError(
            getErrorMessage(error, error.response ? "Transcription failed" : error.message)
          )

        } finally {

          setLoading(false)
        }
      }

      mediaRecorder.start()

      setIsRecording(true)

    } catch (error) {

      console.log(error)

      streamRef.current?.getTracks().forEach((track) => track.stop())

      setError(MIC_ERRORS[error.name] || "Could not start recording")
    }
  }

  // STOP RECORDING
  const stopRecording = () => {

    mediaRecorderRef.current.stop()

    streamRef.current.getTracks().forEach((track) => track.stop())

    setIsRecording(false)
  }

  const canReset =
    !isRecording && !loading && (audioURL || transcript || error)

  return (

    <section className="card p-5 sm:p-6">

      <h2 className="text-lg font-semibold">
        Record audio
      </h2>

      <p className="mt-1 text-sm text-zinc-400">
        Record from your microphone. The transcript starts when you stop.
      </p>

      {/* RECORDING AREA */}
      <div className="mt-5 flex flex-col items-center rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-8">

        <div className={`
          flex
          size-14
          items-center
          justify-center
          rounded-full
          ${isRecording ? "animate-pulse bg-red-600 text-white" : "bg-zinc-800 text-zinc-300"}
        `}>
          <Mic className="size-6" aria-hidden="true" />
        </div>

        {/* TIMER */}
        <p
          role="timer"
          className="mt-4 text-3xl font-semibold tabular-nums"
        >
          {formatTime(recordingTime)}
        </p>

        <p className="mt-1 text-sm text-zinc-500">
          {
            isRecording
              ? "Recording"
              : loading
                ? "Transcribing"
                : "Ready"
          }
        </p>

      </div>

      {/* BUTTONS */}
      <div className="mt-4 flex flex-col gap-2 sm:flex-row">

        {
          isRecording ? (

            <>

              <button
                onClick={stopRecording}
                className="btn btn-danger flex-1"
              >
                <Square className="size-4" aria-hidden="true" />
                Stop and transcribe
              </button>

              <button
                onClick={resetRecording}
                className="btn btn-secondary"
              >
                <Trash2 className="size-4" aria-hidden="true" />
                Discard
              </button>

            </>

          ) : (

            <>

              <button
                onClick={startRecording}
                disabled={loading}
                className="btn btn-primary flex-1"
              >

                {
                  loading
                    ? <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                    : <Mic className="size-4" aria-hidden="true" />
                }

                {loading ? "Transcribing..." : "Start recording"}

              </button>

              {
                canReset && (

                  <button
                    onClick={resetRecording}
                    className="btn btn-secondary"
                  >
                    <RotateCcw className="size-4" aria-hidden="true" />
                    Reset
                  </button>
                )
              }

            </>
          )
        }

      </div>

      {/* ERROR */}
      {
        error && (
          <p className="alert-error mt-4">
            {error}
          </p>
        )
      }

      {/* AUDIO PLAYER */}
      {
        audioURL && (

          <audio
            controls
            src={audioURL}
            aria-label="Recorded audio"
            className="mt-4 w-full"
          />
        )
      }

      {/* TRANSCRIPT */}
      {transcript && <TranscriptResult text={transcript} />}

    </section>
  )
}

export default Recorder
