const multer = require("multer")
const path = require("path")

// Storage Config
const storage = multer.diskStorage({

  destination: (req, file, cb) => {
    cb(null, "uploads/")
  },

  filename: (req, file, cb) => {

    const uniqueName =
      Date.now() + path.extname(file.originalname)

    cb(null, uniqueName)
  }
})

// File Validation
const fileFilter = (req, file, cb) => {

  const allowedTypes = [
    "audio/mpeg",
    "audio/wav",
    "audio/mp3"
  ]

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error("Only audio files allowed"), false)
  }
}

const upload = multer({
  storage,
  fileFilter,
})

module.exports = upload