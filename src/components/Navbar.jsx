import { Link, useLocation } from "react-router-dom"

import {
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/clerk-react"

function Navbar() {

  const location = useLocation()

  const navLinks = [
    {
      name: "Home",
      path: "/",
    },
    {
      name: "History",
      path: "/history",
    },
  ]

  return (

    <nav className="
      sticky
      top-0
      z-50
      border-b
      border-zinc-800/50
      bg-black/70
      backdrop-blur-xl
    ">

      <div className="
        max-w-7xl
        mx-auto
        px-6
        py-4
        flex
        items-center
        justify-between
      ">

        {/* LOGO */}
        <Link
          to="/"
          className="
            text-3xl
            font-black
            tracking-tight
          "
        >

          <span className="
            bg-gradient-to-r
            from-purple-400
            to-blue-400
            bg-clip-text
            text-transparent
          ">
            Transcripto
          </span>

          <span className="text-white">
            AI
          </span>

        </Link>

        {/* NAVIGATION */}
        <div className="
          flex
          items-center
          gap-3
        ">

          {
            navLinks.map((link) => (

              <Link
                key={link.path}
                to={link.path}
                className={`
                  px-5
                  py-2
                  rounded-xl
                  transition
                  font-medium
                  ${
                    location.pathname === link.path
                      ? "bg-zinc-800 text-white"
                      : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
                  }
                `}
              >
                {link.name}
              </Link>
            ))
          }

          {/* LOGGED OUT */}
          <SignedOut>

            <Link
              to="/login"
              className="
                text-zinc-400
                hover:text-white
                transition
                px-4
              "
            >
              Login
            </Link>

            <Link
              to="/register"
              className="
                bg-white
                text-black
                px-5
                py-2
                rounded-xl
                font-semibold
                hover:scale-105
                transition
              "
            >
              Get Started
            </Link>

          </SignedOut>

          {/* LOGGED IN */}
          <SignedIn>

            <div className="
              ml-3
              border
              border-zinc-800
              rounded-full
              p-1
              bg-zinc-900/60
            ">
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: {
                      width: "40px",
                      height: "40px",
                    },
                  },
                }}
              />
            </div>

          </SignedIn>

        </div>

      </div>

    </nav>
  )
}

export default Navbar