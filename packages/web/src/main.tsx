import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import Login from './pages/login.tsx';
import Register from './pages/register.tsx';
import UpdatePassword from './pages/updatePassword.tsx';
import UserManage from './pages/user_manage.tsx';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
const routes = [
    {

        path: "/",
        element: <App />,
        children: [
            {
                path: "user_manage",
                element: <UserManage />,
            }
        ]
    },
    {
        path: "/login",
        element: <Login />,
    },
    {
        path: "register",
        element: <Register />,
    },
    {
        path: "update_password",
        element: <UpdatePassword />,
    }
];
const router = createBrowserRouter(routes);

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

root.render(<RouterProvider router={router} />);
