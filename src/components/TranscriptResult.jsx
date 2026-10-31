import CopyButton from "./CopyButton"

function TranscriptResult({ text }) {

  return (

    <div className="mt-6 border-t border-zinc-800 pt-6">

      <div className="mb-3 flex items-center justify-between gap-3">

        <h3 className="font-medium">
          Transcript
        </h3>

        <CopyButton text={text} />

      </div>

      <p className="max-h-80 overflow-y-auto rounded-lg bg-zinc-950 p-4 text-sm leading-7 break-words whitespace-pre-wrap text-zinc-300">
        {text}
      </p>

    </div>
  )
}

export default TranscriptResult
