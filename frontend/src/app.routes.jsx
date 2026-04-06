import { createBrowserRouter, RouterProvider } from 'react-router';
import App from './App.jsx';
import Login from './features/auth/pages/Login.jsx';
import Register from './features/auth/pages/Register.jsx';
import Protected from './features/auth/components/Protected.jsx';
import Home from './features/interview/pages/Home.jsx';
import Interview from './features/interview/pages/Interview.jsx';


export const router = createBrowserRouter([
    {
        path: "/",
        element:<Protected><Home /></Protected>,
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
        path:"/interview/:interviewId",
        element:<Protected><Interview/></Protected>
    }

])
