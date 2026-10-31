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

        <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">

          <h1 className="mb-6 text-3xl font-semibold tracking-tight">
            Something went wrong
          </h1>

          <button
            onClick={() => window.location.assign("/")}
            className="btn btn-primary"
          >
            Back to home
          </button>

        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
