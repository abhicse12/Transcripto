import { Link, NavLink } from "react-router-dom"

import {
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/clerk-react"

import { AudioLines } from "lucide-react"

const navLinkClass = ({ isActive }) => `
  rounded-lg px-3 py-2 text-sm font-medium transition-colors
  ${isActive ? "bg-zinc-800 text-white" : "text-zinc-400 hover:text-white"}
`

function Navbar() {

  return (

    <nav className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-950/90 backdrop-blur">

      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">

        {/* LOGO */}
        <Link
          to="/"
          className="flex items-center gap-2 text-lg font-semibold tracking-tight"
        >
          <AudioLines className="size-5" aria-hidden="true" />
          <span className="max-[359px]:sr-only">Transcripto</span>
        </Link>

        <div className="flex items-center gap-1 sm:gap-2">

          {/* LOGGED OUT */}
          <SignedOut>

            <Link to="/login" className="btn text-zinc-300 hover:text-white">
              Sign in
            </Link>

            <Link to="/register" className="btn btn-primary">
              Get started
            </Link>

          </SignedOut>

          {/* LOGGED IN */}
          <SignedIn>

            <NavLink to="/" end className={navLinkClass}>
              Transcribe
            </NavLink>

            <NavLink to="/history" className={navLinkClass}>
              History
            </NavLink>

            <div className="ml-2 flex items-center">
              <UserButton />
            </div>

          </SignedIn>

        </div>

      </div>

    </nav>
  )
}

export default Navbar
