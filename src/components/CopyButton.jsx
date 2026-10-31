import { useState } from "react"

import { Check, Copy } from "lucide-react"

const LABEL_DELAY = 2000

function CopyButton({ text }) {

  const [label, setLabel] = useState("Copy")

  const handleCopy = async () => {

    try {

      await navigator.clipboard.writeText(text)

      setLabel("Copied")

    } catch (error) {

      console.log(error)

      setLabel("Copy failed")
    }

    setTimeout(() => setLabel("Copy"), LABEL_DELAY)
  }

  return (

    <button onClick={handleCopy} disabled={!text} className="btn btn-secondary">

      {
        label === "Copied"
          ? <Check className="size-4" aria-hidden="true" />
          : <Copy className="size-4" aria-hidden="true" />
      }

      {label}

    </button>
  )
}

export default CopyButton
