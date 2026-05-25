import { useEffect, useState } from "react"
import { useUser } from "@clerk/clerk-react"
import API from "../api/axios"

function History() {

  const [transcripts, setTranscripts] = useState([])
  const [loading, setLoading] = useState(true)
  const { user } = useUser()

  const fetchTranscripts = async () => {

    try {

      const response = await API.get(
        `/transcript?userId=${user.id}`
      )

      setTranscripts(response.data.transcripts)

    } catch (error) {

      console.log(error)

    } finally {

      setLoading(false)
    }
  }

  useEffect(() => {

    if (user) {
      fetchTranscripts()
    }

  }, [user])

  return (

    <div className="min-h-screen bg-black text-white px-6 py-12">

      {/* HEADER */}
      <div className="max-w-6xl mx-auto mb-12">

        <h1 className="text-5xl font-bold">
          Transcription History
        </h1>

        <p className="text-zinc-400 mt-4 text-lg">
          View all your previous AI-generated transcriptions.
        </p>

      </div>

      {/* LOADING */}
      {
        loading && (
          <div className="text-center text-zinc-400 text-xl">
            Loading transcripts...
          </div>
        )
      }

      {/* EMPTY STATE */}
      {
        !loading && transcripts.length === 0 && (
          <div className="text-center text-zinc-500 text-xl mt-20">
            No transcriptions found
          </div>
        )
      }

      {/* TRANSCRIPTS */}
      <div className="max-w-6xl mx-auto grid gap-6">

        {
          transcripts.map((item) => (

            <div
              key={item._id}
              className="
                bg-zinc-900
                border border-zinc-800
                rounded-3xl
                p-8
                hover:border-zinc-700
                transition
              "
            >

              {/* TOP */}
              <div className="flex items-center justify-between mb-6">

                <div>

                  <p className="text-green-400 font-semibold text-lg">
                    {item.fileName}
                  </p>

                  <p className="text-zinc-500 text-sm mt-1">
                    {
                      new Date(item.createdAt)
                        .toLocaleString()
                    }
                  </p>

                </div>

                <div className="bg-black px-4 py-2 rounded-xl border border-zinc-800 text-sm text-zinc-400">
                  AI Transcript
                </div>

              </div>

              {/* TRANSCRIPT */}
              <div className="bg-black border border-zinc-800 rounded-2xl p-6">

                <p className="text-zinc-300 leading-8 whitespace-pre-wrap">
                  {item.transcriptText}
                </p>

              </div>

            </div>
          ))
        }

      </div>

    </div>
  )
}

export default History