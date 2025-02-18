import {  Layout } from "antd";
import { Outlet } from "react-router-dom";


export const BaseLayout: React.FC = () => {

    return (
        <Layout style={{ minHeight: "100vh" }}>
          
             <Outlet />
        </Layout>
    );
};