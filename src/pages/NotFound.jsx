import { Link } from "react-router-dom"

function NotFound() {

  return (

    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">

      <h1 className="text-6xl font-black mb-4">
        404
      </h1>

      <p className="text-zinc-400 text-lg mb-8">
        This page does not exist.
      </p>

      <Link
        to="/"
        className="bg-white text-black px-6 py-3 rounded-2xl font-semibold"
      >
        Back to Home
      </Link>

    </div>
  )
}

export default NotFound
