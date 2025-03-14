import React, { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react';

import { notification } from 'antd';
import { useAppSelector } from "@/App/store/AppStore.ts";
import { BASE_URL } from '@/Shared/const';


const ServerConnectionContext = createContext<EventSource | null>(null);

export const ServerConnectionProvider: React.FC<PropsWithChildren> = ({ children }) => {

    //
    //
    // const [connection, setConnection] = useState<signalR.HubConnection | null>(null);
    //
    // useEffect(() => {
    //     const newConnection = new signalR.HubConnectionBuilder()
    //         .withUrl(baseUrl + '/chathub')
    //         .withAutomaticReconnect()
    //         .build();
    //
    //     setConnection(newConnection);
    //
    //     newConnection.start()
    //         .then(() => console.log('Connected!'))
    //         .catch(e => console.log('Connection failed: ', e));
    //
    //     return () => {
    //         newConnection.stop();
    //     };
    // }, []);

    const { id } = useAppSelector(state => state.user);

    const [connection, setConnection] = useState<EventSource | null>(null);

    useEffect(() => {
        const eventSource = new EventSource(`${BASE_URL}chat/subscribe/${id}`);

        eventSource.onopen = () => {
            console.log('Connected!');
        };

        eventSource.onerror = (e) => {
            console.log('Connection failed: ', e);
            notification.error({ message: 'Connection failed', description: 'Please, refresh the page' });
        };

        //eventSource.addEventListener("message", console.log)

        setConnection(eventSource);

        return () => {
            eventSource.close();
        };
    }, []);


    return (
        <>

            <ServerConnectionContext.Provider value={connection}>
                {children}
            </ServerConnectionContext.Provider>
        </>
    );
};

export const useServerConnection = () => useContext(ServerConnectionContext);
