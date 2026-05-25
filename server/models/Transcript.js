const mongoose = require("mongoose")

const transcriptSchema = new mongoose.Schema({

  userId: {
    type: String,
 },  

  fileName: {
    type: String,
  },

  transcriptText: {
    type: String,
  },

}, {
  timestamps: true,
})

module.exports = mongoose.model(
  "Transcript",
  transcriptSchema
)