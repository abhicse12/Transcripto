import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'

import App from './App'
import ErrorBoundary from './components/ErrorBoundary'

import {
  ClerkProvider,
} from '@clerk/clerk-react'

const clerkPubKey =
  import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

ReactDOM.createRoot(document.getElementById('root')).render(

  <React.StrictMode>

    <ErrorBoundary>

      <ClerkProvider
        publishableKey={clerkPubKey}
        signInUrl="/login"
        signUpUrl="/register"
        afterSignOutUrl="/"
      >

        <App />

      </ClerkProvider>

    </ErrorBoundary>

  </React.StrictMode>,
)