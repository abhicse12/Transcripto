import { useState } from "react"


function UploadBox() {

  const [audioFile, setAudioFile] = useState(null)

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

          </div>
        )
      }

    </div>
  )
}

export default UploadBox