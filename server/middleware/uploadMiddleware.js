const crypto = require("crypto")
const fs = require("fs")
const multer = require("multer")
const path = require("path")

const uploadDir = path.join(__dirname, "..", "uploads")

fs.mkdirSync(uploadDir, { recursive: true })

// Storage Config
const storage = multer.diskStorage({

  destination: (req, file, cb) => {
    cb(null, uploadDir)
  },

  filename: (req, file, cb) => {

    const uniqueName =
      crypto.randomUUID() + path.extname(file.originalname)

    cb(null, uniqueName)
  }
})

// File Validation
const fileFilter = (req, file, cb) => {

  const allowedTypes = [
    "audio/mpeg",
    "audio/mp3",
    "audio/wav",
    "audio/wave",
    "audio/x-wav",
    "audio/webm",
    "video/webm",
    "audio/mp4",
    "audio/m4a",
    "audio/x-m4a",
    "audio/aac",
    "audio/ogg",
    "audio/flac",
    "audio/x-flac",
  ]

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true)
  } else {

    const error = new Error(
      "Unsupported file type. Use MP3, WAV, WEBM, M4A, AAC, OGG or FLAC."
    )

    error.status = 400

    cb(error, false)
  }
}

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024,
    files: 1,
  },
})

module.exports = upload
