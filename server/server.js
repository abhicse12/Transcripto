require("dotenv").config()

const express = require("express")
const cors = require("cors")
const helmet = require("helmet")
const { clerkMiddleware } = require("@clerk/express")

const connectDB = require("./config/db")
const errorHandler = require("./middleware/errorMiddleware")
const transcriptRoutes = require("./routes/transcriptRoutes")

const requiredEnv = [
  "MONGO_URI",
  "ASSEMBLY_API_KEY",
  "CLERK_PUBLISHABLE_KEY",
  "CLERK_SECRET_KEY",
]

const missingEnv = requiredEnv.filter((name) => !process.env[name])

if (missingEnv.length > 0) {
  console.error(`Missing environment variables: ${missingEnv.join(", ")}`)
  process.exit(1)
}

const allowedOrigins = (
  process.env.CLIENT_URLS ||
  "https://transcripto-silk.vercel.app,http://localhost:5173"
).split(",").map((origin) => origin.trim())

const app = express()

// Middleware
app.use(helmet())
app.use(cors({ origin: allowedOrigins }))
app.use(clerkMiddleware())

app.use("/api/transcript", transcriptRoutes)

// Test Route
app.get("/", (req, res) => {
  res.send("Backend Server Running")
})

app.use(errorHandler)

const PORT = process.env.PORT || 5000

const startServer = async () => {

  await connectDB()

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

startServer()
