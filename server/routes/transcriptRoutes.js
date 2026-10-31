const express = require("express")

const router = express.Router()

const requireUser = require("../middleware/authMiddleware")
const uploadLimiter = require("../middleware/rateLimitMiddleware")
const upload = require("../middleware/uploadMiddleware")

const {
  uploadAudio,
  getTranscripts,
  getTranscript,
  deleteTranscript,
} = require("../controllers/transcriptController")

router.use(requireUser)

router.get("/", getTranscripts)

router.get("/:id", getTranscript)

router.delete("/:id", deleteTranscript)

router.post(
  "/upload",
  uploadLimiter,
  upload.single("audio"),
  uploadAudio
)

module.exports = router
