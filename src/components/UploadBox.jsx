import { useState } from "react"
import API from "../api/axios"
import { useUser } from "@clerk/clerk-react"


function UploadBox() {
  const { user } = useUser()
  const [audioFile, setAudioFile] = useState(null)
  const [loading, setLoading] = useState(false)

  const [transcript, setTranscript] = useState("")
  const [error, setError] = useState("")

  const handleFileChange = (e) => {

    const file = e.target.files[0]

    if (!file) return

    // Audio validation
    if (
      file.type !== "audio/mpeg" &&
      file.type !== "audio/wav"
    ) {
      alert("Only MP3 and WAV files are allowed")
      return
    }

    setAudioFile(file)
  }

  const handleUpload = async () => {

  if (!audioFile) {
    return alert("Please select audio file")
  }

  try {

    setLoading(true)

    setTranscript("")

    setError("")

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

    setError("Failed to generate transcription")

  } finally {

    setLoading(false)
  }
}

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 max-w-2xl mx-auto">

      <h2 className="text-3xl font-bold mb-6">
        Upload Audio
      </h2>

      <label className="flex flex-col items-center justify-center border-2 border-dashed border-zinc-700 rounded-2xl p-10 cursor-pointer hover:bg-zinc-800 transition">

        <input
          type="file"
          accept=".mp3,.wav"
          className="hidden"
          onChange={handleFileChange}
        />

        <p className="text-lg text-zinc-300">
          Click to Upload Audio
        </p>

        <p className="text-sm text-zinc-500 mt-2">
          MP3 or WAV only
        </p>

      </label>

      {
        audioFile && (
          <div className="mt-6 bg-black p-4 rounded-xl border border-zinc-800">

            <p className="text-green-400 font-medium">
              Selected File:
            </p>

            <p className="text-zinc-300 mt-1">
              {audioFile.name}
            </p>
            <button
            onClick={handleUpload}
            disabled={loading}
            className="mt-6 bg-white text-black px-6 py-3 rounded-xl font-semibold hover:scale-105 transition"
            >
            {
                loading
                ? "Uploading..."
                : "Upload Audio"
            }
            </button>
            {
            loading && (

                <div className="mt-8 text-center">

                <p className="text-blue-400 text-lg animate-pulse">
                    Generating AI transcription...
                </p>

                </div>
            )
            }
            {
            error && (

                <div className="mt-6 bg-red-500/10 border border-red-500 rounded-2xl p-4">

                <p className="text-red-400">
                    {error}
                </p>

                </div>
            )
            }
            {
            transcript && (

                <div className="mt-8 bg-black border border-zinc-800 rounded-2xl p-8">

                <div className="flex items-center justify-between mb-6">

                    <h3 className="text-3xl font-bold">
                    AI Transcription
                    </h3>

                    <div className="bg-green-500/10 text-green-400 px-4 py-2 rounded-xl border border-green-500/20">
                    Completed
                    </div>

                </div>

                <p className="text-zinc-300 leading-8 whitespace-pre-wrap">
                    {transcript}
                </p>

                </div>
            )
            }

          </div>
        )
      }

    </div>
  )
}

export default UploadBox