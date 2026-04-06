import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router'
import { AuthProvider } from './features/auth/Auth.context.jsx'
import { InterviewProvider } from './features/interview/interview.context.jsx'
import { router } from './app.routes.jsx'



createRoot(document.getElementById('root')).render(
  <StrictMode>
    <>
    <AuthProvider>
      <InterviewProvider>
        <RouterProvider router={router} />
      </InterviewProvider>
    </AuthProvider>
    </>
  </StrictMode> 
)
  