import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom"
import ProtectedRoute from "./components/ProtectedRoute"

import Navbar from "./components/Navbar"

import Home from "./pages/Home"
import Login from "./pages/Login"
import Register from "./pages/Register"
import History from "./pages/History"
import NotFound from "./pages/NotFound"

function App() {
  return (
    <BrowserRouter>

      <div className="flex min-h-screen flex-col">

        <Navbar />

        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/history"
              element={
                <ProtectedRoute>
                  <History />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        <footer className="border-t border-zinc-800 px-4 py-6 text-center text-sm text-zinc-500">
          Transcription by AssemblyAI. Sign-in by Clerk.
        </footer>

      </div>

    </BrowserRouter>
  )
}

export default App
