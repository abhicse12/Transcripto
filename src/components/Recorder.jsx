import { useRef, useState, useEffect } from "react"

import API from "../api/axios"

import { useUser } from "@clerk/clerk-react"

function Recorder() {

  const [isRecording, setIsRecording] = useState(false)

  const [audioURL, setAudioURL] = useState("")

  const [transcript, setTranscript] = useState("")

  const [loading, setLoading] = useState(false)

  const [recordingTime, setRecordingTime] = useState(0)

  const mediaRecorderRef = useRef(null)

  const audioChunksRef = useRef([])

  const timerRef = useRef(null)

  const { user } = useUser()

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

      const mediaRecorder = new MediaRecorder(stream)

      mediaRecorderRef.current = mediaRecorder

      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {

        audioChunksRef.current.push(event.data)
      }

      // ON STOP
      mediaRecorder.onstop = async () => {

        const audioBlob = new Blob(

          audioChunksRef.current,

          {
            type: "audio/webm",
          }
        )

        const audioUrl = URL.createObjectURL(audioBlob)

        setAudioURL(audioUrl)

        const audioFile = new File(

          [audioBlob],

          "recording.webm",

          {
            type: "audio/webm",
          }
        )

        try {

          setLoading(true)

          const formData = new FormData()

          formData.append("audio", audioFile)

          formData.append("userId", user.id)

          const response = await API.post(

            "/transcript/upload",

            formData
          )

          setTranscript(response.data.transcript)

        } catch (error) {

          console.log(error)

          alert("Transcription failed")

        } finally {

          setLoading(false)
        }
      }

      mediaRecorder.start()

      setIsRecording(true)

    } catch (error) {

      console.log(error)

      alert("Microphone access denied")
    }
  }

  // STOP RECORDING
  const stopRecording = () => {

    mediaRecorderRef.current.stop()

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
      p-8
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
        p-10
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
                px-10
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