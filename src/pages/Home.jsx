import UploadBox from "../components/UploadBox"
import Recorder from "../components/Recorder"

import {
  SignedIn,
  SignedOut,
} from "@clerk/clerk-react"

function Home() {

  return (

    <div className="min-h-screen bg-black text-white overflow-hidden relative">

      {/* BACKGROUND GLOW */}
      <div className="absolute inset-0 -z-10">

        <div className="
          absolute
          top-0
          left-1/4
          w-72
          sm:w-96
          h-72
          sm:h-96
          bg-purple-500/20
          blur-3xl
          rounded-full
        " />

        <div className="
          absolute
          bottom-0
          right-1/4
          w-72
          sm:w-96
          h-72
          sm:h-96
          bg-blue-500/20
          blur-3xl
          rounded-full
        " />

      </div>

      {/* HERO SECTION */}
      <section className="
        flex
        flex-col
        items-center
        justify-center
        text-center
        py-24
        sm:py-32
        px-4
        sm:px-6
      ">

        {/* BADGE */}
        <div className="
          border
          border-zinc-800
          bg-zinc-900/60
          backdrop-blur-xl
          px-5
          py-2
          rounded-full
          mb-8
        ">

          <p className="
            text-xs
            sm:text-sm
            text-zinc-300
          ">
            AI Powered Speech-To-Text Platform
          </p>

        </div>

        {/* TITLE */}
        <h1 className="
          text-5xl
          sm:text-6xl
          md:text-8xl
          font-black
          leading-tight
          max-w-5xl
        ">

          Convert Voice Into

          <span className="
            bg-gradient-to-r
            from-purple-400
            to-blue-400
            bg-clip-text
            text-transparent
          ">
            {" "}Smart Text
          </span>

        </h1>

        {/* DESCRIPTION */}
        <p className="
          text-zinc-400
          text-base
          sm:text-lg
          md:text-xl
          mt-8
          max-w-3xl
          leading-8
          sm:leading-9
        ">

          Upload audio or record your voice and generate
          accurate AI-powered transcriptions instantly with
          secure cloud-based history and authentication.

        </p>

        {/* BUTTONS */}
        <div className="
          flex
          flex-col
          sm:flex-row
          gap-5
          mt-12
          w-full
          sm:w-auto
        ">

          <button className="
            w-full
            sm:w-auto
            bg-white
            text-black
            px-8
            py-4
            rounded-2xl
            font-semibold
            hover:scale-105
            transition
            shadow-2xl
          ">
            Start Transcribing
          </button>

          <button className="
            w-full
            sm:w-auto
            border
            border-zinc-700
            bg-zinc-900/60
            backdrop-blur-xl
            px-8
            py-4
            rounded-2xl
            hover:bg-zinc-800
            transition
          ">
            Explore Features
          </button>

        </div>

      </section>

      {/* FEATURES SECTION */}
      <section className="
        max-w-7xl
        mx-auto
        grid
        grid-cols-1
        md:grid-cols-3
        gap-8
        px-4
        sm:px-6
        pb-24
      ">

        {/* FEATURE 1 */}
        <div className="
          bg-zinc-900/60
          backdrop-blur-xl
          border
          border-zinc-800
          rounded-3xl
          p-8
          hover:border-purple-500/30
          hover:-translate-y-2
          transition
          duration-300
        ">

          <div className="
            w-14
            h-14
            rounded-2xl
            bg-purple-500/10
            flex
            items-center
            justify-center
            mb-6
            text-2xl
          ">
            🎵
          </div>

          <h2 className="text-2xl font-bold mb-4">
            Audio Upload
          </h2>

          <p className="text-zinc-400 leading-8">
            Upload MP3, WAV or WEBM audio files and generate
            high-quality AI transcriptions instantly.
          </p>

        </div>

        {/* FEATURE 2 */}
        <div className="
          bg-zinc-900/60
          backdrop-blur-xl
          border
          border-zinc-800
          rounded-3xl
          p-8
          hover:border-blue-500/30
          hover:-translate-y-2
          transition
          duration-300
        ">

          <div className="
            w-14
            h-14
            rounded-2xl
            bg-blue-500/10
            flex
            items-center
            justify-center
            mb-6
            text-2xl
          ">
            🎙️
          </div>

          <h2 className="text-2xl font-bold mb-4">
            Live Recording
          </h2>

          <p className="text-zinc-400 leading-8">
            Record your voice directly from browser using
            MediaRecorder API with real-time AI processing.
          </p>

        </div>

        {/* FEATURE 3 */}
        <div className="
          bg-zinc-900/60
          backdrop-blur-xl
          border
          border-zinc-800
          rounded-3xl
          p-8
          hover:border-green-500/30
          hover:-translate-y-2
          transition
          duration-300
        ">

          <div className="
            w-14
            h-14
            rounded-2xl
            bg-green-500/10
            flex
            items-center
            justify-center
            mb-6
            text-2xl
          ">
            🤖
          </div>

          <h2 className="text-2xl font-bold mb-4">
            AI Transcription
          </h2>

          <p className="text-zinc-400 leading-8">
            Powered by advanced AI speech recognition for
            accurate and fast voice-to-text conversion.
          </p>

        </div>

      </section>

      {/* AUTHENTICATED USER */}
      <SignedIn>

        <div className="pb-20 px-4 sm:px-6">
          <UploadBox />
        </div>

        <div className="pb-24 px-4 sm:px-6">
          <Recorder />
        </div>

      </SignedIn>

      {/* LOGGED OUT */}
      <SignedOut>

        <div className="
          text-center
          py-20
          border-t
          border-zinc-900
          px-4
        ">

          <h2 className="
            text-3xl
            sm:text-4xl
            font-bold
            mb-5
          ">
            Login Required
          </h2>

          <p className="
            text-zinc-400
            text-base
            sm:text-lg
          ">
            Please login to upload and transcribe audio.
          </p>

        </div>

      </SignedOut>

    </div>
  )
}

export default Home