const fs = require("fs")
const mongoose = require("mongoose")

const Transcript = require("../models/Transcript")
const client = require("../config/assemblyai")

const MAX_PAGE_SIZE = 50

// Multer decodes multipart filenames as latin1
const decodeFileName = (name) =>
  Buffer.from(name, "latin1").toString("utf8")

const escapeRegex = (text) =>
  text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")

// Copy the AssemblyAI result onto a record that is still processing
const syncTranscript = async (transcript) => {

  if (transcript.status !== "processing") {
    return transcript
  }

  const result = await client.transcripts.get(transcript.assemblyId)

  if (result.status === "completed") {

    transcript.status = "completed"
    transcript.transcriptText = result.text || ""

    await transcript.save()

  } else if (result.status === "error") {

    console.log(`Transcript ${result.id} failed: ${result.error}`)

    transcript.status = "failed"
    transcript.errorMessage =
      "Could not transcribe this audio. Please check the file and try again."

    await transcript.save()
  }

  return transcript
}

const uploadAudio = async (req, res) => {

  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "No file uploaded",
    })
  }

  // LOCAL FILE PATH
  const filePath = req.file.path

  try {

    // SEND TO ASSEMBLYAI
    const submitted = await client.transcripts.submit({
      audio: filePath,
      speech_models: ["universal-2"],
      language_detection: true,
    })

    const transcript = await Transcript.create({

      userId: req.userId,

      fileName: decodeFileName(req.file.originalname),

      assemblyId: submitted.id,

      status: "processing",
    })

    res.status(202).json({
      success: true,
      transcript,
    })

  } catch (error) {

    console.log(error)

    res.status(500).json({
      success: false,
      message: "Transcription failed",
    })

  } finally {

    // DELETE TEMP FILE
    await fs.promises.rm(filePath, { force: true }).catch(console.log)
  }
}

const getTranscripts = async (req, res) => {

  try {

    const page = Math.max(Number.parseInt(req.query.page, 10) || 1, 1)

    const limit = Math.min(
      Math.max(Number.parseInt(req.query.limit, 10) || 10, 1),
      MAX_PAGE_SIZE
    )

    const filter = { userId: req.userId }

    if (typeof req.query.search === "string" && req.query.search.trim()) {
      filter.transcriptText = {
        $regex: escapeRegex(req.query.search.trim()),
        $options: "i",
      }
    }

    const [transcripts, total] = await Promise.all([
      Transcript.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      Transcript.countDocuments(filter),
    ])

    res.status(200).json({
      success: true,
      transcripts,
      total,
      hasMore: page * limit < total,
    })

  } catch (error) {

    console.log(error)

    res.status(500).json({
      success: false,
      message: "Failed to fetch transcripts",
    })
  }
}

const getTranscript = async (req, res) => {

  try {

    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid transcript id",
      })
    }

    const transcript = await Transcript.findOne({
      _id: req.params.id,
      userId: req.userId,
    })

    if (!transcript) {
      return res.status(404).json({
        success: false,
        message: "Transcript not found",
      })
    }

    await syncTranscript(transcript)

    res.status(200).json({
      success: true,
      transcript,
    })

  } catch (error) {

    console.log(error)

    res.status(500).json({
      success: false,
      message: "Failed to fetch transcript",
    })
  }
}

const deleteTranscript = async (req, res) => {

  try {

    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid transcript id",
      })
    }

    const transcript = await Transcript.findOne({
      _id: req.params.id,
      userId: req.userId,
    })

    if (!transcript) {

      return res.status(404).json({
        success: false,
        message: "Transcript not found",
      })
    }

    await syncTranscript(transcript)

    // AssemblyAI cannot delete a job that is still running
    if (transcript.status === "processing") {
      return res.status(409).json({
        success: false,
        message: "This transcript is still processing. Try again when it finishes.",
      })
    }

    // Older records have no AssemblyAI id
    if (transcript.assemblyId) {
      await client.transcripts.delete(transcript.assemblyId)
    }

    await transcript.deleteOne()

    res.status(200).json({
      success: true,
      message: "Transcript deleted",
    })

  } catch (error) {

    console.log(error)

    res.status(500).json({
      success: false,
      message: "Delete failed",
    })
  }
}

module.exports = {
  uploadAudio,
  getTranscripts,
  getTranscript,
  deleteTranscript,
}
