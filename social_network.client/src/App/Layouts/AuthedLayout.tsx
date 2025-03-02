import { AppHeader } from "@/Widgets/header";
import { Content } from "antd/es/layout/layout";
import { PropsWithChildren, Suspense, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAppSelector } from "../store/AppStore";
import { pathRouterBuilder } from "@/Shared/utils/pathRouterBuilder";
import { pathes } from "../router/pathes";
import { useWSConnection, WSConnectionProvider } from "@/Contexts/WSConnectionContext";
import { notification } from "antd";

export const AuthedLayout: React.FC = () => {

    // const { id, nickname } = useAppSelector(state => state.user);

    // const navigate = useNavigate();

    // useEffect(() => {
    //     if (id) {
    //         navigate(pathRouterBuilder(pathes.profile.absolute, { nickname }));
    //     }
    // }
    //     , [id, navigate]);

    return (<WSConnectionProvider>
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
    </WSConnectionProvider>);
};

const NotyManager: React.FC<PropsWithChildren> = ({ children }) => {
    const { id } = useAppSelector(state => state.user);

    const [api, contextHolder] = notification.useNotification();
    const connection = useWSConnection();


    useEffect(() => {
        if (connection) {
            connection.on('ReceiveMessage', msg => {

                if (msg.sender?.id === id) return;

                console.log(msg);
                api.info({
                    message: `From: ${msg.sender?.name}`,
                    description: msg.message,
                    placement: "topRight",
                });
                //message.info(`New message from ${msg.sender?.name}: ${msg.message}`);
            });
        }
    }, [connection]);

    return (<>
        {contextHolder}</>);
};