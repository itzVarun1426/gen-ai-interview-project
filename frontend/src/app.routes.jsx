import { createBrowserRouter, RouterProvider } from 'react-router';
import App from './App.jsx';
import Login from './features/auth/pages/Login.jsx';
import Register from './features/auth/pages/Register.jsx';
import Protected from './features/auth/components/Protected.jsx';
import Landing from './features/interview/pages/Landing.jsx';
import Dashboard from './features/interview/pages/Dashboard.jsx';
import Interview from './features/interview/pages/Interview.jsx';
import InterviewSetup from './features/interview/pages/InterviewSetup.jsx';
import InterviewSelection from './features/interview/pages/InterviewSelection.jsx';
import Evaluation from './features/interview/pages/Evaluation.jsx';

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Landing />,
    },
    {
        path: "/login",
        element: <Login />
    },
    {
        path: "/register",
        element: <Register />
    },
    {
        path: "/dashboard",
        element: <Protected><Dashboard /></Protected>
    },
    {
        path: "/interview/select/:interviewId",
        element: <Protected><InterviewSelection /></Protected>
    },
    {
        path: "/interview/setup/:interviewId",
        element: <Protected><InterviewSetup /></Protected>
    },
    {
        path: "/interview/:interviewId",
        element: <Protected><Interview /></Protected>
    },
    {
        path: "/evaluation/:interviewId",
        element: <Protected><Evaluation /></Protected>
    }
])
