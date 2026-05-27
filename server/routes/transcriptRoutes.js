const express = require("express")
const Transcript = require("../models/Transcript")

const router = express.Router()

const upload = require("../middleware/uploadMiddleware")

const {
  uploadAudio,
  getTranscripts,
  deleteTranscript,
} = require("../controllers/transcriptController")

router.get("/", getTranscripts)

router.delete("/:id", deleteTranscript)

router.post(
  "/upload",
  upload.single("audio"),
  uploadAudio
)

module.exports = router