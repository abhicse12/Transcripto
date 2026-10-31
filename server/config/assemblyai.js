const { AssemblyAI } = require("assemblyai")

const client = new AssemblyAI({
  apiKey: process.env.ASSEMBLY_API_KEY,
})

module.exports = client