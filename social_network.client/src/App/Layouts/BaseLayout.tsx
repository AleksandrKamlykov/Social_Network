import { Divider, Layout, Typography } from "antd";
import React, { Suspense, useState } from "react";
import { Outlet } from "react-router-dom";
import { AppHeader } from "@/Widgets/header";

const { Sider, Content } = Layout;

export const BaseLayout: React.FC = () => {
    const [visibleMenu, setVisibleMenu] = useState(true);

    const showMenuHandler = () => setVisibleMenu(prev => !prev);

    return (
        <Layout style={{ minHeight: "100vh" }}>
          
            <Layout>
                <AppHeader
                    
                />
                <Content
                    style={{
                        margin: "24px auto",
                        padding: 24,
                        height: "100%",
                        width:"100%",
                        maxWidth:1600,
                    }}
                >
                    <Suspense fallback={<div>Loading...</div>}>
                        <Outlet />
                    </Suspense>
                </Content>
            </Layout>
        </Layout>
    );
};