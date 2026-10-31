import {
  SignIn
} from "@clerk/clerk-react"

function Login() {

  return (

    <div className="flex justify-center px-4 py-12">

      <SignIn />

    </div>
  )
}

export default Login