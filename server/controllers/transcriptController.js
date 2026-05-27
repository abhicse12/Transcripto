const Transcript = require("../models/Transcript")
const fs = require("fs")

const client = require("../config/openai")

const uploadAudio = async (req, res) => {

  try {

    if (!req.file) {
      return res.status(400).json({
        message: "No file uploaded",
      })
    }

    // LOCAL FILE PATH
    const filePath = req.file.path

    // READ FILE
    const audioData = fs.readFileSync(filePath)

    // TRANSCRIBE
    const transcript = await client.transcripts.transcribe({
    audio: audioData,
    speech_models: ["universal-2"],
    })

    await Transcript.create({

    userId: req.body.userId,

    fileName: req.file.filename,

    transcriptText: transcript.text,
    })
    // DELETE TEMP FILE
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath)
    }

    res.status(200).json({

      success: true,

      transcript: transcript.text,
    })

  } catch (error) {

    console.log(error)

    res.status(500).json({
      success: false,
      message: "Transcription failed",
    })
  }
}
const getTranscripts = async (req, res) => {

  try {

    const transcripts = await Transcript.find({
    userId: req.query.userId,
    }).sort({ createdAt: -1 })

    res.status(200).json({
      success: true,
      transcripts,
    })

  } catch (error) {

    console.log(error)

    res.status(500).json({
      success: false,
      message: "Failed to fetch transcripts",
    })
  }
}

const deleteTranscript = async (req, res) => {

  try {

    const transcript = await Transcript.findByIdAndDelete(
      req.params.id
    )

    if (!transcript) {

      return res.status(404).json({
        success: false,
        message: "Transcript not found",
      })
    }

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
  deleteTranscript,
}