import { Link } from "react-router-dom"

function NotFound() {

  return (

    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">

      <h1 className="text-4xl font-semibold tracking-tight">
        Page not found
      </h1>

      <p className="mt-3 mb-8 text-zinc-400">
        This page does not exist.
      </p>

      <Link to="/" className="btn btn-primary">
        Back to home
      </Link>

    </div>
  )
}

export default NotFound
