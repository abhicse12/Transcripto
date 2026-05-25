import UploadBox from "../components/UploadBox"
import Recorder from "../components/Recorder"
function Home() {
  return (
    <div className="min-h-screen bg-black text-white">

      {/* HERO SECTION */}
      <section className="flex flex-col items-center justify-center text-center py-32 px-6">

        <h1 className="text-6xl md:text-7xl font-bold leading-tight max-w-4xl">
          Convert Voice Into Text With AI
        </h1>

        <p className="text-zinc-400 text-lg mt-6 max-w-2xl">
          Upload audio or record your voice and generate accurate
          AI-powered transcriptions instantly using Whisper AI.
        </p>

        <div className="flex gap-4 mt-10">

          <button className="bg-white text-black px-8 py-3 rounded-xl font-semibold hover:scale-105 transition">
            Start Transcribing
          </button>

          <button className="border border-zinc-700 px-8 py-3 rounded-xl hover:bg-zinc-900 transition">
            Learn More
          </button>

        </div>

      </section>

      {/* FEATURES SECTION */}
      <section className="grid md:grid-cols-3 gap-6 px-10 pb-20">

        <div className="bg-zinc-900 p-8 rounded-2xl border border-zinc-800">
          <h2 className="text-2xl font-bold mb-4">
            Audio Upload
          </h2>

          <p className="text-zinc-400">
            Upload MP3 or WAV audio files and generate instant transcriptions.
          </p>
        </div>

        <div className="bg-zinc-900 p-8 rounded-2xl border border-zinc-800">
          <h2 className="text-2xl font-bold mb-4">
            Live Recording
          </h2>

          <p className="text-zinc-400">
            Record your voice directly from browser using MediaRecorder API.
          </p>
        </div>

        <div className="bg-zinc-900 p-8 rounded-2xl border border-zinc-800">
          <h2 className="text-2xl font-bold mb-4">
            AI Transcription
          </h2>

          <p className="text-zinc-400">
            Powered by Whisper AI for fast and accurate speech-to-text conversion.
          </p>
        </div>

      </section>

      <div className="pb-20 px-6">
        <UploadBox />
      </div>

      <Recorder />

    </div>
  )
}

export default Home