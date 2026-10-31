import {
  SignIn
} from "@clerk/clerk-react"

function Login() {

  return (

    <div className="min-h-screen bg-black flex items-center justify-center px-4 py-10">

      <SignIn />

    </div>
  )
}

export default Login