import API from "./axios"

const POLL_INTERVAL = 3000

const MAX_POLL_TIME = 30 * 60 * 1000

const MAX_POLL_FAILURES = 5

export const MAX_FILE_SIZE = 100 * 1024 * 1024

const authConfig = async (getToken) => ({
  headers: {
    Authorization: `Bearer ${await getToken()}`,
  },
})

const wait = (time) =>
  new Promise((resolve) => setTimeout(resolve, time))

// Prefer the message sent by the server
export const getErrorMessage = (error, fallback) =>
  error.response?.data?.message || fallback

export const fetchTranscripts = async (getToken, params) => {

  const response = await API.get("/transcript", {
    ...(await authConfig(getToken)),
    params,
  })

  return response.data
}

export const fetchTranscript = async (getToken, id) => {

  const response = await API.get(
    `/transcript/${id}`,
    await authConfig(getToken)
  )

  return response.data.transcript
}

export const deleteTranscript = async (getToken, id) => {

  await API.delete(
    `/transcript/${id}`,
    await authConfig(getToken)
  )
}

// Upload the audio, then wait for the transcript text
export const transcribeAudio = async (getToken, file) => {

  const formData = new FormData()

  formData.append("audio", file)

  const response = await API.post(
    "/transcript/upload",
    formData,
    await authConfig(getToken)
  )

  const { _id: id } = response.data.transcript

  const startTime = Date.now()

  let failures = 0

  while (Date.now() - startTime < MAX_POLL_TIME) {

    await wait(POLL_INTERVAL)

    let transcript

    try {

      transcript = await fetchTranscript(getToken, id)

      failures = 0

    } catch (error) {

      failures += 1

      if (failures >= MAX_POLL_FAILURES) {
        throw error
      }

      continue
    }

    if (transcript.status === "failed") {
      throw new Error(transcript.errorMessage)
    }

    if (transcript.status === "completed") {

      if (!transcript.transcriptText) {
        throw new Error("No speech was detected in this audio.")
      }

      return transcript.transcriptText
    }
  }

  throw new Error(
    "This is taking longer than usual. The transcript will appear in History when it finishes."
  )
}
