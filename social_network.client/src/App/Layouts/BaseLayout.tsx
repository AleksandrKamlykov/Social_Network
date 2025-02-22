import { Layout } from "antd";
import { Outlet, useNavigate } from "react-router-dom";
import { useAppSelector } from "../store/AppStore";
import { useEffect } from "react";


export const BaseLayout: React.FC = () => {

    const { id, roles } = useAppSelector(state => state.user);
    const navigate = useNavigate();

    // useEffect(() => {
    //     if (!id) {
    //         navigate('/auth');
    //     }
    // }
    //     , [
    //         id, roles
    //     ]);


    return (
        <Layout style={{ minHeight: "100vh" }}>

            <Outlet />
        </Layout>
    );
};