import React, { useState, useEffect } from 'react';
import * as signalR from '@microsoft/signalr';
import { useRequestData } from '@/Shared/api/useRequestData.ts';
import { useAppSelector } from '@/App/store/AppStore.ts';
import { IUser } from '@/Enteties/user/types.ts';
import { useRequest } from '@/Shared/api/useRequest.ts';
import {Button, Card, Input, Layout, List, Spin, Typography} from "antd";
import dayjs from "dayjs";
import { theme } from 'antd';

const baseUrl = 'https://localhost:7075';

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

export const ChatPage = () => {
    const { id,name } = useAppSelector(state => state.user);
    const [connection, setConnection] = useState<signalR.HubConnection | null>(null);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
    const [chatRoomId, setChatRoomId] = useState(null);


    const { data: followers, loading: usersLoading, get } = useRequestData<IUser[]>();
    const { get: fetchChatHistory, loading: chatLoading } = useRequest();
    const {  loading: chatRoomLoading, get: fetchChatRoom } = useRequest();

    const fetchUsers = async () => {
        await get(`Followers/following/${id}`);
    };

    useEffect(() => {
        fetchUsers();

        // Create a connection to the SignalR hub
        const newConnection = new signalR.HubConnectionBuilder()
            .withUrl(baseUrl + '/chathub')
            .withAutomaticReconnect()
            .build();

        setConnection(newConnection);
    }, []);

    useEffect(() => {
        if (connection) {
            connection.start()
                .then(result => {
                    console.log('Connected!');

                    connection.on('ReceiveMessage', message => {
                        setMessages(messages => [...messages, message]);
                    });
                })
                .catch(e => console.log('Connection failed: ', e));
        }
    }, [connection]);

    useEffect(() => {
        if (chatRoomId && connection) {
            connection.invoke('JoinRoom', chatRoomId);

            fetchChatHistory(`chat/rooms/${chatRoomId}/messages`)
                .then(data => setMessages(data.data));

        }
    }, [connection, chatRoomId]);

        const sendMessage = async () => {
            console.log(connection);

            if ( id && connection && connection.state === signalR.HubConnectionState.Connected) {
                try {

                    await connection.invoke('SendMessage', chatRoomId, id, message);
                    setMessage('');
                } catch (e) {
                    console.error(e);
                }
            } else {
                console.log(id , connection)
                alert('No connection to server yet.');
            }
        };

        const selectUser = async (user) => {
                setSelectedUser(user);
                // Fetch or create chat room with the selected user
                const {data: chatRoom} = await fetchChatRoom(`chat/rooms/${id}/${user.id}`);
                console.log(chatRoom);
                setChatRoomId(chatRoom.id);




        };


    const { token } = theme.useToken();
    const primaryColor = token.colorPrimary;

    const myColor = token.colorTextLightSolid;

return(
    <Layout style={{ height: '80vh', padding:0 }} >
        <Sider width={300} style={{ background: '#fff', padding: '20px' }}>
            <Title level={3}>Followers</Title>
            {usersLoading ? <Spin /> : (
                <List
                    itemLayout="horizontal"
                    dataSource={followers ??[]}
                    renderItem={follower => (
                        <List.Item onClick={() => selectUser(follower)}>
                            <List.Item.Meta
                                title={follower.name}
                            />
                        </List.Item>
                    )}
                />
            )}
        </Sider>
        <Layout>
            <Header style={{ background: '#fff', padding: '0 20px' }}>
                <Title level={3}>Chat with {selectedUser ? selectedUser.name : '...'}</Title>
            </Header>
            <Content style={{ padding: '20px', display: 'flex', flexDirection: 'column' }}>
                <div style={{ flex: 1, overflowY: 'scroll', border: '1px solid #ccc', padding: '10px', display:"flex", flexDirection:"column-reverse", gap:12 }}>
                    {chatLoading ? <Spin /> : (
                        messages?.map((msg, index) => {

                            const isMyMessage = msg.senderId === id;


                            return(
                                <Card
                                    style={{backgroundColor: isMyMessage ? primaryColor : undefined, color: isMyMessage ? myColor : undefined, width: 'fit-content', alignSelf: isMyMessage ? 'flex-end' : 'flex-start'}}
                                    key={msg.id}
                                    title={<div style={{ textAlign: isMyMessage ? 'right' : 'left',color: isMyMessage ? myColor : undefined }}>{
                                        isMyMessage ? "You" : selectedUser?.name
                                    }</div>}
                                >
                                    <Typography style={{color: isMyMessage ? myColor : undefined}}>{msg.message}</Typography>
                                    <div style={{ textAlign: 'right' }}><small>{dayjs(msg.sendAt).format("DD.MM.YY HH:mm:ss")}</small></div>
                                </Card>)
                        }))
                    }
                </div>
                {selectedUser && (
                    <div style={{ marginTop: '20px', display: 'flex' }}>
                        <Input
                            value={message}
                            onChange={e => setMessage(e.target.value)}
                            onPressEnter={sendMessage}
                            placeholder="Type a message"
                            style={{ flex: 1, marginRight: '10px' }}
                        />
                        <Button type="primary" onClick={sendMessage}>Send</Button>
                    </div>
                )}
            </Content>
        </Layout>
    </Layout>
)



};
