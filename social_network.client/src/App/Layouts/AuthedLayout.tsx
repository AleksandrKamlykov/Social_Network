import { AppHeader } from "@/Widgets/header";
import { Content } from "antd/es/layout/layout";
import {  Suspense, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useAppSelector } from "../store/AppStore";
import { useServerConnection, ServerConnectionProvider } from "@/Contexts/ServerConnectionContext.tsx";
import { notification } from "antd";
import {toLowerFirsLetterInObj} from "../../../utils/toLowerFirsLetterInObj.ts";

export const AuthedLayout: React.FC = () => {



    return (<ServerConnectionProvider>
        <NotyManager />
        <AppHeader />
        <Content
            style={{
                margin: "24px auto",
                padding: 24,
                height: "100%",
                width: "100%",
                maxWidth: 1600,
            }}
        >
            <Suspense fallback={<div>Loading...</div>}>
                <Outlet />
            </Suspense>
        </Content>
    </ServerConnectionProvider>);
};

const NotyManager: React.FC= () => {
    const { id } = useAppSelector(state => state.user);

    const [api, contextHolder] = notification.useNotification();
    const connection = useServerConnection();


    useEffect(() => {
        if (connection) {

            connection.addEventListener("message",event=>{
                const message = JSON.parse(event.data);
                const msg = toLowerFirsLetterInObj(message);

                console.log(msg);

                if(msg.senderId !== id) {
                    api.info({
                        message: `From: ${msg.senderName}`,
                        description: msg.message,
                        placement: "topRight",
                    });
                };





            })

        }
    }, [connection]);

    return (<>
        {contextHolder}
    </>);
};