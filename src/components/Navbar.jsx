import { Link, NavLink } from "react-router-dom"

import {
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/clerk-react"

import { AudioLines } from "lucide-react"

const navLinkClass = ({ isActive }) => `
  nav-link
  ${isActive ? "bg-violet-500/20 text-violet-100" : ""}
`

function Navbar() {

  return (

    <nav className="sticky top-0 z-50 border-b border-white/10 bg-zinc-950/70 backdrop-blur">

      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">

        {/* LOGO */}
        <Link
          to="/"
          className="group flex items-center gap-2 text-lg font-semibold tracking-tight transition-colors duration-300 hover:text-violet-200"
        >
          <span className="flex size-8 items-center justify-center rounded-lg bg-linear-to-br from-violet-600 to-fuchsia-600 text-white transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6 motion-reduce:transform-none">

            <AudioLines className="size-5" aria-hidden="true" />
          </span>
          <span className="max-[399px]:sr-only">Transcripto</span>
        </Link>

        <div className="flex items-center gap-1 sm:gap-2">

          {/* LOGGED OUT */}
          <SignedOut>

            <Link to="/login" className="btn btn-ghost">
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
