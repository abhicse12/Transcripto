import { useRef, useState, useEffect } from "react"

import {
  getErrorMessage,
  transcribeAudio,
} from "../api/transcripts"

import { useAuth } from "@clerk/clerk-react"

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

  // START RECORDING
  const startRecording = async () => {

    try {

      setTranscript("")

      setRecordingTime(0)

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

          alert(
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

      alert(MIC_ERRORS[error.name] || "Could not start recording")
    }
  }

  // STOP RECORDING
  const stopRecording = () => {

    mediaRecorderRef.current.stop()

    streamRef.current.getTracks().forEach((track) => track.stop())

    setIsRecording(false)
  }

  // COPY
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

          Live AI

          <span className="
            bg-gradient-to-r
            from-red-400
            to-pink-400
            bg-clip-text
            text-transparent
          ">
            {" "}Voice Recording
          </span>

        </h2>

        <p className="
          text-zinc-400
          text-lg
          max-w-2xl
          mx-auto
          leading-8
        ">

          Record your voice directly from browser and
          instantly generate AI-powered transcriptions.

        </p>

      </div>

      {/* RECORDING AREA */}
      <div className="
        bg-black/40
        border
        border-zinc-800
        rounded-3xl
        p-5
        sm:p-10
        text-center
      ">

        {/* MIC ANIMATION */}
        <div className="
          flex
          justify-center
          mb-8
        ">

          <div className={`
            relative
            w-32
            h-32
            rounded-full
            flex
            items-center
            justify-center
            transition-all
            duration-300
            ${
              isRecording
                ? "bg-red-500 animate-pulse scale-110"
                : "bg-zinc-800"
            }
          `}>

            <span className="text-5xl">
              🎙️
            </span>

            {
              isRecording && (
                <div className="
                  absolute
                  inset-0
                  rounded-full
                  border-4
                  border-red-400
                  animate-ping
                " />
              )
            }

          </div>

        </div>

        {/* TIMER */}
        <div className="mb-8">

          <p className="
            text-5xl
            font-black
            tracking-wider
          ">

            {formatTime(recordingTime)}

          </p>

          <p className="text-zinc-500 mt-2">
            Recording Timer
          </p>

        </div>

        {/* BUTTON */}
        {
          !isRecording ? (

            <button
              onClick={startRecording}
              disabled={loading}
              className="
                bg-white
                text-black
                px-6
                sm:px-10
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
              Start Recording
            </button>

          ) : (

            <button
              onClick={stopRecording}
              className="
                bg-red-500
                text-white
                px-6
                sm:px-10
                py-4
                rounded-2xl
                font-bold
                text-lg
                hover:scale-105
                transition
                shadow-xl
              "
            >
              Stop Recording
            </button>
          )
        }

        {/* STATUS */}
        {
          isRecording && (

            <p className="
              text-red-400
              mt-6
              animate-pulse
              text-lg
            ">
              Recording in progress...
            </p>
          )
        }

        {
          loading && (

            <p className="
              text-blue-400
              mt-6
              animate-pulse
              text-lg
            ">
              AI is generating transcription...
            </p>
          )
        }

      </div>

      {/* AUDIO PLAYER */}
      {
        audioURL && (

          <div className="
            mt-10
            bg-black/40
            border
            border-zinc-800
            rounded-3xl
            p-6
          ">

            <h3 className="
              text-2xl
              font-bold
              mb-5
            ">
              Recorded Audio
            </h3>

            <audio
              controls
              src={audioURL}
              className="w-full"
            />

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
                  Recorded Transcript
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

export default Recorder