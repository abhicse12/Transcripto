import { Link } from "react-router-dom"

import UploadBox from "../components/UploadBox"
import Recorder from "../components/Recorder"

import {
  SignedIn,
  SignedOut,
} from "@clerk/clerk-react"

import { ArrowRight, FileAudio, Globe, History, Mic } from "lucide-react"

const FEATURES = [
  {
    icon: FileAudio,
    tile: "bg-violet-500/15 text-violet-300",
    title: "Bring your recordings",
    text: "Meetings, lectures, voice notes. MP3, WAV, WEBM, M4A, AAC, OGG and FLAC, up to 100 MB.",
  },
  {
    icon: Mic,
    tile: "bg-rose-500/15 text-rose-300",
    title: "Or just start talking",
    text: "Hit record, say what's on your mind, play it back. Not happy? Reset and take it again.",
  },
  {
    icon: Globe,
    tile: "bg-cyan-500/15 text-cyan-300",
    title: "Detects the language",
    text: "No settings to hunt for. The spoken language is detected automatically, file by file.",
  },
  {
    icon: History,
    tile: "bg-amber-500/15 text-amber-300",
    title: "Words you can find again",
    text: "Search, copy or delete anything in your history. It stays private to your account.",
  },
]

const STEPS = [
  {
    title: "Add your audio",
    text: "Pick a file from your device or record straight from the browser.",
  },
  {
    title: "Let it listen",
    text: "AssemblyAI's speech recognition turns your audio into text while you carry on.",
  },
  {
    title: "Keep your words",
    text: "Copy the transcript in a click, or come back to it anytime in your history.",
  },
]

function Home() {

  return (

    <>

      {/* AUTHENTICATED USER */}
      <SignedIn>

        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">

          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            What are we <span className="text-gradient">writing down</span> today?
          </h1>

          <p className="mt-3 text-zinc-400">
            Drop in a file or hit record. Every finished transcript lands in your history.
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
          <section className="mx-auto max-w-4xl py-20 text-center sm:py-28">

            <p className="inline-block rounded-full border border-violet-400/30 bg-violet-500/10 px-4 py-1.5 text-sm font-medium text-violet-200">
              Speech to text, right in your browser
            </p>

            <h1 className="mt-8 text-5xl font-bold tracking-tight text-balance sm:text-7xl">
              Say it once. <span className="text-gradient">Keep it in writing.</span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-zinc-300">
              Great ideas shouldn't get lost in a recording. Upload your audio or
              tap the mic, and Transcripto turns the spoken word into text you can
              search, copy and come back to.
            </p>

            <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">

              <Link to="/register" className="btn btn-primary px-7 py-3.5 text-base">
                Start transcribing
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>

              <Link to="/login" className="btn btn-secondary px-7 py-3.5 text-base">
                I have an account
              </Link>

            </div>

          </section>

          {/* FEATURES SECTION */}
          <section className="grid gap-4 pb-20 sm:grid-cols-2 lg:grid-cols-4">

            {
              FEATURES.map((feature) => (

                <div
                  key={feature.title}
                  className="card p-6 transition hover:-translate-y-1 hover:border-violet-400/40"
                >

                  <div className={`icon-tile ${feature.tile}`}>
                    <feature.icon className="size-5" aria-hidden="true" />
                  </div>

                  <h2 className="mt-5 font-semibold">
                    {feature.title}
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-zinc-400">
                    {feature.text}
                  </p>

                </div>
              ))
            }

          </section>

          {/* HOW IT WORKS */}
          <section className="pb-20">

            <h2 className="text-center text-3xl font-bold tracking-tight sm:text-4xl">
              From voice to text in <span className="text-gradient">three steps</span>
            </h2>

            <ol className="mt-10 grid gap-8 md:grid-cols-3">

              {
                STEPS.map((step, index) => (

                  <li key={step.title} className="text-center">

                    <span className="mx-auto flex size-11 items-center justify-center rounded-full bg-linear-to-br from-violet-600 to-fuchsia-600 font-semibold text-white">
                      {index + 1}
                    </span>

                    <h3 className="mt-4 font-semibold">
                      {step.title}
                    </h3>

                    <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-zinc-400">
                      {step.text}
                    </p>

                  </li>
                ))
              }

            </ol>

          </section>

          {/* CALL TO ACTION */}
          <section className="mb-20 rounded-3xl border border-violet-400/20 bg-linear-to-br from-violet-600/25 via-fuchsia-600/15 to-cyan-500/15 px-6 py-14 text-center">

            <h2 className="text-3xl font-bold tracking-tight text-balance sm:text-4xl">
              Got something worth keeping?
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-zinc-300">
              Create an account and turn your first recording into text.
            </p>

            <Link to="/register" className="btn btn-primary mt-8 px-7 py-3.5 text-base">
              Create your account
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>

          </section>

        </div>

      </SignedOut>

    </>
  )
}

export default Home
