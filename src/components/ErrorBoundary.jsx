import { Component } from "react"

class ErrorBoundary extends Component {

  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error) {
    console.log(error)
  }

  render() {

    if (this.state.hasError) {

      return (

        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center text-center px-4">

          <h1 className="text-3xl font-bold mb-4">
            Something went wrong
          </h1>

          <button
            onClick={() => window.location.assign("/")}
            className="bg-white text-black px-6 py-3 rounded-2xl font-semibold"
          >
            Back to Home
          </button>

        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
