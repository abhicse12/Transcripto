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

      <div className="min-h-screen bg-black text-white">

        <Navbar />

        <div>
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
        </div>

      </div>

    </BrowserRouter>
  )
}

export default App