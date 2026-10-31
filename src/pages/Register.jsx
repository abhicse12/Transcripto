import {
  SignUp
} from "@clerk/clerk-react"

function Register() {

  return (

    <div className="min-h-screen bg-black flex items-center justify-center px-4 py-10">

      <SignUp />

    </div>
  )
}

export default Register