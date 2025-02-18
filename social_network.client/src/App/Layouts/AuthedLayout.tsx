import { AppHeader } from "@/Widgets/header";
import useApp from "antd/es/app/useApp";
import { Content } from "antd/es/layout/layout";
import {  Suspense, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAppSelector } from "../store/AppStore";
import { pathRouterBuilder } from "@/Shared/utils/pathRouterBuilder";
import { pathes } from "../router/pathes";

export const AuthedLayout: React.FC = ()=> {

const {id,nickname} = useAppSelector(state => state.user);

const navigate = useNavigate();

useEffect(() => {
    if (id) {
        navigate(pathRouterBuilder(pathes.profile.absolute,{nickname}));
    }
}
, [id,navigate]);

    return (<>
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
    </>);
}