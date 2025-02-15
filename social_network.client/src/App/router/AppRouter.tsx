import {lazy} from "react";
import {createBrowserRouter, Navigate, RouteObject, RouterProvider} from "react-router-dom";
import {useAppSelector} from "@/App/store/AppStore";
import {pathes} from "./pathes";
import { BaseLayout } from "@/App/Layouts/BaseLayout";
const MainPage = lazy(() => import("@/Pages/MainPage"));
const Profile = lazy(() => import("@/Pages/Profile"));
const AuthPage = lazy(() => import("@/Pages/Auth"));
const RegistrationPage = lazy(() => import("@/Pages/Registration"));



const routes: RouteObject[] = [
    {
        path: "/",
        element: <BaseLayout />,

        children: [
            {
                path: pathes.home.relative,
                id: pathes.home.id,
                element: <MainPage />
            },
            {
                path: pathes.profile.relative,
                id: pathes.profile.id,
                element: <Profile />,
                
            },
      
            {
                path: "/*",
                element: <Navigate to={pathes.home.relative} />
            }
        ]
    },
    {
        path: pathes.auth.absolute,
        element: <AuthPage />
    },
    {
        path: "/*",
        element: <Navigate to={pathes.auth.absolute} />
    }
];

const router = createBrowserRouter(routes);

export const AppRouter = () => {
    const { id,roles } = useAppSelector(state => state.user);

    const HasRoles = roles.length > 0;


    const finalRouter = id && HasRoles
        ? router
        : createBrowserRouter([
              { path: "/*", element: <Navigate to={pathes.auth.absolute} /> },
              {
                path: pathes.auth.absolute,
                element: <AuthPage/>
            },
            {
                path: pathes.registration.absolute,
                element: <RegistrationPage />
            }
        
          ]);
console.log(finalRouter);
    return <RouterProvider router={finalRouter} />;
};