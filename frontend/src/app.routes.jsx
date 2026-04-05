import { createBrowserRouter, RouterProvider } from 'react-router';
import App from './App.jsx';
import Login from './features/auth/pages/Login.jsx';
import Register from './features/auth/pages/Register.jsx';
import Protected from './features/auth/components/Protected.jsx';
import Home from './features/interview/pages/Home.jsx';


export const router = createBrowserRouter([
    {
        path: "/",
        element:<Protected><App /></Protected>,
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
        path:"/interview:interviewId",
        element:<Protected><Home/></Protected>
    }

])
