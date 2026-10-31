import { Link } from "react-router-dom"

import UploadBox from "../components/UploadBox"
import Recorder from "../components/Recorder"

import {
  SignedIn,
  SignedOut,
} from "@clerk/clerk-react"

import { FileAudio, Globe, History, Mic } from "lucide-react"

const FEATURES = [
  {
    icon: FileAudio,
    title: "Upload audio",
    text: "MP3, WAV, WEBM, M4A, AAC, OGG and FLAC files up to 100 MB.",
  },
  {
    icon: Mic,
    title: "Record in the browser",
    text: "Use your microphone, play the recording back, and reset to try again.",
  },
  {
    icon: Globe,
    title: "Language detection",
    text: "The spoken language is detected automatically for each file.",
  },
  {
    icon: History,
    title: "Saved history",
    text: "Search, copy or delete your transcripts. Only your account can see them.",
  },
]

function Home() {

  return (

    <>

      {/* AUTHENTICATED USER */}
      <SignedIn>

        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">

          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            New transcript
          </h1>

          <p className="mt-2 text-zinc-400">
            Upload a file or record audio. Finished transcripts are saved to your history.
          </p>

          <div className="mt-8 grid items-start gap-6 lg:grid-cols-2">
            <UploadBox />
            <Recorder />
          </div>

        </div>

      </SignedIn>

      {/* LOGGED OUT */}
      <SignedOut>

        <div className="mx-auto max-w-6xl px-4 sm:px-6">

          {/* HERO SECTION */}
          <section className="mx-auto max-w-3xl py-20 text-center sm:py-28">

            <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-6xl">
              Turn speech into text
            </h1>

            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-zinc-400">
              Upload an audio file or record from your browser, and keep
              every transcript in one place.
            </p>

            <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">

              <Link to="/register" className="btn btn-primary px-6 py-3">
                Get started
              </Link>

              <Link to="/login" className="btn btn-secondary px-6 py-3">
                Sign in
              </Link>

            </div>

          </section>

          {/* FEATURES SECTION */}
          <section className="grid gap-4 pb-20 sm:grid-cols-2 lg:grid-cols-4">

            {
              FEATURES.map((feature) => (

                <div key={feature.title} className="card p-5">

                  <feature.icon className="size-5 text-zinc-400" aria-hidden="true" />

                  <h2 className="mt-4 font-medium">
                    {feature.title}
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-zinc-400">
                    {feature.text}
                  </p>

                </div>
              ))
            }

          </section>

        </div>

      </SignedOut>

    </>
  )
}

export default Home
