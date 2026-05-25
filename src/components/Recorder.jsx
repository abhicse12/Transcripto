import { useRef, useState } from "react"

function Recorder() {

  const [isRecording, setIsRecording] = useState(false)
  const [audioURL, setAudioURL] = useState("")

  const mediaRecorderRef = useRef(null)
  const audioChunksRef = useRef([])

  // START RECORDING
  const startRecording = async () => {

    try {

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      })

      const mediaRecorder = new MediaRecorder(stream)

      mediaRecorderRef.current = mediaRecorder

      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data)
      }

      mediaRecorder.onstop = () => {

        const audioBlob = new Blob(
          audioChunksRef.current,
          { type: "audio/wav" }
        )

        const audioUrl = URL.createObjectURL(audioBlob)

        setAudioURL(audioUrl)
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

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 max-w-2xl mx-auto mt-10">

      <h2 className="text-3xl font-bold mb-6">
        Live Audio Recording
      </h2>

      <div className="flex gap-4">

        {
          !isRecording ? (
            <button
              onClick={startRecording}
              className="bg-green-500 text-black px-6 py-3 rounded-xl font-semibold"
            >
              Start Recording
            </button>
          ) : (
            <button
              onClick={stopRecording}
              className="bg-red-500 text-white px-6 py-3 rounded-xl font-semibold"
            >
              Stop Recording
            </button>
          )
        }

      </div>

      {
        isRecording && (
          <p className="text-red-400 mt-4 animate-pulse">
            Recording...
          </p>
        )
      }

      {
        audioURL && (
          <div className="mt-6">

            <p className="mb-2 text-zinc-300">
              Recorded Audio:
            </p>

            <audio controls src={audioURL} />
          </div>
        )
      }

    </div>
  )
}

export default Recorder