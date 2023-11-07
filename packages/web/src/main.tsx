import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import Login from './pages/login.tsx';
import Register from './pages/register.tsx';
import UpdatePassword from './pages/updatePassword.tsx';
import UserManage from './pages/user_manage.tsx';
import { RouteObject, RouterProvider, createBrowserRouter } from 'react-router-dom';
import Menu from './pages/menu.tsx';
import { ModifyMenu } from './pages/ModifyMenu/ModifyMenu.tsx';
import { InfoModify } from './pages/ModifyMenu/InfoModify.tsx';
import { PasswordModify } from './pages/ModifyMenu/PasswordModify.tsx';
import { MeetingRoomManage } from './pages/mettingRoom/MeetingRoomManage.tsx';
import { BookingManage } from './pages/mettingRoom/BookingManage.tsx';
import { Statistics } from './pages/mettingRoom/Statistics.tsx';
const routes: RouteObject[] = [
    {

        path: "/",
        element: <App />,
        children: [
            {
                path: "",
                element: <Menu></Menu>,
                children: [
                    {
                        path: "",
                        element: <MeetingRoomManage />
                    },
                    {
                        path: "meeting_room_manage",
                        element: <MeetingRoomManage />
                    },
                    {
                        path: "booking_manage",
                        element: <BookingManage />
                    },
                    {
                        path: "statistics",
                        element: <Statistics />
                    },
                    {
                        path: 'user_manage',
                        element: <UserManage />
                    }
                ]
            }
        ]
    },
    {
        path: "/user",
        element: <ModifyMenu></ModifyMenu>,
        children: [
            {
                path: 'info_modify',
                element: <InfoModify />
            },
            {
                path: 'password_modify',
                element: <PasswordModify />
            },
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
