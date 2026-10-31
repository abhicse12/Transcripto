const mongoose = require("mongoose")

const transcriptSchema = new mongoose.Schema({

  userId: {
    type: String,
    required: true,
  },

  fileName: {
    type: String,
    required: true,
  },

  // Records created before this field existed are all finished transcripts
  status: {
    type: String,
    enum: ["processing", "completed", "failed"],
    default: "completed",
  },

  assemblyId: {
    type: String,
  },

  transcriptText: {
    type: String,
    default: "",
  },

  errorMessage: {
    type: String,
  },

}, {
  timestamps: true,
})

transcriptSchema.index({ userId: 1, createdAt: -1 })

module.exports = mongoose.model(
  "Transcript",
  transcriptSchema
)
