import { Link } from "react-router-dom"

import {
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/clerk-react"

function Navbar() {

  return (

    <nav className="bg-zinc-900 text-white px-8 py-4 flex justify-between items-center">

      <Link
        to="/"
        className="text-2xl font-bold"
      >
        Transcripto AI
      </Link>

      <div className="flex items-center gap-6">

        <Link to="/">
          Home
        </Link>

        <Link to="/history">
          History
        </Link>

        <SignedOut>

          <Link to="/login">
            Login
          </Link>

          <Link to="/register">
            Register
          </Link>

        </SignedOut>

        <SignedIn>

          <UserButton />

        </SignedIn>

      </div>

    </nav>
  )
}

export default Navbar