import { Link } from "react-router-dom"

function Navbar() {
  return (
    <nav className="bg-zinc-900 text-white px-8 py-4 flex justify-between items-center">
      
      <Link
        to="/"
        className="text-2xl font-bold"
      >
        Transcripto AI
      </Link>

      <div className="flex gap-6">
        <Link to="/">Home</Link>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/history">History</Link>
        <Link to="/login">Login</Link>
      </div>

    </nav>
  )
}

export default Navbar