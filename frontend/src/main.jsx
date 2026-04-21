import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router'
import { ThemeProvider } from './context/ThemeContext.jsx'
import { AuthProvider } from './features/auth/Auth.context.jsx'
import { InterviewProvider } from './features/interview/interview.context.jsx'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { router } from './app.routes.jsx'
import './index.css'

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

createRoot(document.getElementById('root')).render(
  <>
    <GoogleOAuthProvider clientId={googleClientId}>
      <ThemeProvider>
        <AuthProvider>
          <InterviewProvider>
            <RouterProvider router={router} />
          </InterviewProvider>
        </AuthProvider>
      </ThemeProvider>
    </GoogleOAuthProvider>
  </>
)
