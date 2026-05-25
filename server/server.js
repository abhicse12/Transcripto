const express = require("express")
const connectDB = require("./config/db")
const cors = require("cors")
require("dotenv").config()

connectDB()

const app = express()

// Middleware
app.use(cors())
app.use(express.json())

const transcriptRoutes = require("./routes/transcriptRoutes")
app.use("/api/transcript", transcriptRoutes)

// Test Route
app.get("/", (req, res) => {
  res.send("Backend Server Running")
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})