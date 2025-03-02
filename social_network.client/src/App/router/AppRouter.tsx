import { lazy, useMemo } from "react";
import { createBrowserRouter, Navigate, RouteObject, RouterProvider } from "react-router-dom";
import { useAppSelector } from "@/App/store/AppStore";
import { pathes } from "./pathes";
import { BaseLayout } from "@/App/Layouts/BaseLayout";
import { AuthedLayout } from "../Layouts/AuthedLayout";

const MainPage = lazy(() => import("@/Pages/MainPage"));
const Profile = lazy(() => import("@/Pages/Profile"));
const AuthPage = lazy(() => import("@/Pages/Auth"));
const RegistrationPage = lazy(() => import("@/Pages/Registration"));
const UsersPage = lazy(() => import("@/Pages/Users"));
const AdminPage = lazy(() => import("@/Pages/Admin"));
const ChatPage = lazy(() => import("@/Pages/Chat"));

const routes: RouteObject[] = [
    {
        path: "/",
        element: <AuthedLayout />,
        children: [
            {
                path: pathes.home.relative,
                id: pathes.home.id,
                element: <MainPage />,
                index: true
            },
            {
                path: pathes.profile.relative,
                id: pathes.profile.id,
                element: <Profile />
            },
            {
                path: pathes.users.relative,
                id: pathes.users.id,
                element: <UsersPage />
            },
            {
                path: pathes.admin.relative,
                id: pathes.admin.id,
                element: <AdminPage />
            },
            {
                path: pathes.chat.relative,
                id: pathes.chat.id,
                element: <ChatPage />
            },
            {
                path: "*",
                element: <Navigate to={pathes.home.relative} />
            }
        ]
    }
];

const notAuthedRoutes: RouteObject[] = [
    {
        path: "/",
        element: <Navigate to={pathes.auth.relative} />
    },
    {
        path: pathes.registration.relative,
        id: pathes.registration.id,
        element: <RegistrationPage />
    },
    {
        path: pathes.auth.relative,
        id: pathes.auth.id,
        element: <AuthPage />
    },
    { path: "*", element: <Navigate to={pathes.auth.relative} /> }
];

export const AppRouter = () => {
    const { id, roles } = useAppSelector(state => state.user);
    const hasRoles = roles.length > 0;
    const isAuthed = Boolean(id && hasRoles);

    const finalRoutes = useMemo(() => {
        if (isAuthed) {
            return routes;
        } else {
            return notAuthedRoutes;
        }
    }, [isAuthed, id, roles]);

    const baseRoutes: RouteObject[] = [
        {
            path: "",
            element: <BaseLayout />,
            children: finalRoutes
        }
    ];


    const browserRouter = useMemo(() => createBrowserRouter(baseRoutes), [isAuthed]);

    return <RouterProvider router={browserRouter} />;
};