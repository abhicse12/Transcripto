import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom"
import ProtectedRoute from "./components/ProtectedRoute"

import Navbar from "./components/Navbar"

import Home from "./pages/Home"
import Dashboard from "./pages/Dashboard"
import Login from "./pages/Login"
import Register from "./pages/Register"
import History from "./pages/History"

function App() {
  return (
    <BrowserRouter>

      <div className="min-h-screen bg-black text-white">

        <Navbar />

        <div className="p-10">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
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
          </Routes>
        </div>

      </div>

    </BrowserRouter>
  )
}

export default App