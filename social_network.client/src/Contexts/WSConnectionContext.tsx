import React, { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react';
import * as signalR from '@microsoft/signalr';
import { notification } from 'antd';

const baseUrl = 'https://localhost:7075';

const WSConnectionContext = createContext<signalR.HubConnection | null>(null);

export const WSConnectionProvider: React.FC<PropsWithChildren> = ({ children }) => {



    const [connection, setConnection] = useState<signalR.HubConnection | null>(null);

    useEffect(() => {
        const newConnection = new signalR.HubConnectionBuilder()
            .withUrl(baseUrl + '/chathub')
            .withAutomaticReconnect()
            .build();

        setConnection(newConnection);

        newConnection.start()
            .then(() => console.log('Connected!'))
            .catch(e => console.log('Connection failed: ', e));

        return () => {
            newConnection.stop();
        };
    }, []);



    return (
        <>

            <WSConnectionContext.Provider value={connection}>
                {children}
            </WSConnectionContext.Provider>
        </>
    );
};

export const useWSConnection = () => useContext(WSConnectionContext);
