import React, { useState, useEffect } from 'react';
import { useRequestData } from '@/Shared/api/useRequestData.ts';
import { useAppSelector } from '@/App/store/AppStore.ts';
import { IUser } from '@/Enteties/user/types.ts';
import { useRequest } from '@/Shared/api/useRequest.ts';
import { Button, Card, Form, Input, Layout, List, Spin, Typography } from "antd";
import dayjs from "dayjs";
import { theme } from 'antd';
import { WSConnectionProvider, useWSConnection } from '@/Contexts/WSConnectionContext.tsx';
import * as signalR from '@microsoft/signalr';
import { UserListItem } from '@/Enteties/user/ui/userListItem';

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

export const ChatPage = () => {

    const [form] = Form.useForm();

    const { id, name } = useAppSelector(state => state.user);
    const connection = useWSConnection();
    const [messages, setMessages] = useState<any[]>([]);
    const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
    const [chatRoomId, setChatRoomId] = useState<string | null>(null);

    const { data: followers, loading: usersLoading, get } = useRequestData<IUser[]>();

    const { data: chats, loading: chatListLoading, get: fetchChatList } = useRequestData<{ id: string, participant: IUser; }[]>();


    const { get: fetchChatHistory, loading: chatLoading } = useRequest();
    // const { loading: chatRoomLoading, get: fetchChatRoom } = useRequest();

    const fetchUsers = async () => {
        await get(`Followers/following/${id}`);
    };
    const fetchChats = async () => {
        await fetchChatList(`chat/rooms/${id}`);
    };

    useEffect(() => {
        fetchUsers();
        fetchChats();
    }, []);

    useEffect(() => {
        if (connection) {
            connection.on('ReceiveMessage', message => {
                setMessages(messages => [message, ...messages]);
            });
        }
    }, [connection]);

    useEffect(() => {
        if (chatRoomId && connection) {
            connection.invoke('JoinRoom', chatRoomId);

            fetchChatHistory(`chat/rooms/${chatRoomId}/messages`)
                .then(data => setMessages(data.data));
        }
    }, [connection, chatRoomId]);

    const sendMessage = async (message: string) => {
        if (id && connection && connection.state === signalR.HubConnectionState.Connected) {
            try {
                await connection.invoke('SendMessage', chatRoomId, id, message);
                form.resetFields();
            } catch (e) {
                console.error(e);
            }
        } else {
            alert('No connection to server yet.');
        }
    };

    const onFinished = async (values: any) => {
        await sendMessage(values.message);
    };

    const selectUser = async (user: IUser) => {
        setSelectedUser(user);
        // const { data: chatRoom } = await fetchChatRoom(`chat/rooms/${id}/${user.id}`);
        // setChatRoomId(chatRoom.id);
    };

    const { token } = theme.useToken();
    const primaryColor = token.colorPrimary;
    const myColor = token.colorTextLightSolid;
    const borderRadius = token.borderRadius;

    return (
        <WSConnectionProvider>
            <Layout style={{ height: '80vh', padding: 0 }}>
                <Sider width={300} style={{ background: '#fff', padding: '20px' }}>
                    <Title level={3}>Chats</Title>
                    <List
                        loading={chatLoading}
                        itemLayout="horizontal"
                        dataSource={chats ?? []}
                        renderItem={chat => (
                            <List.Item onClick={() => {
                                selectUser(chat.participant);
                                setChatRoomId(chat.id);
                            }}
                                style={{
                                    cursor: 'pointer',
                                    backgroundColor: chatRoomId === chat.id ? primaryColor : undefined,
                                    color: chatRoomId === chat.id ? myColor : undefined,
                                    padding: '8px 12px',
                                    borderRadius: borderRadius,

                                }}
                            >
                                <UserListItem user={chat.participant} />
                            </List.Item>
                        )}
                    />


                </Sider>
                <Layout>
                    <Header style={{ background: '#fff', padding: '0 20px' }}>
                        <Title level={3}> {selectedUser ? selectedUser.name : 'Not selected chat'}</Title>
                    </Header>
                    <Content style={{ padding: '20px', display: 'flex', flexDirection: 'column' }}>
                        <div style={{ flex: 1, overflowY: 'scroll', border: '1px solid #ccc', padding: '10px', display: "flex", flexDirection: "column-reverse", gap: 12 }}>
                            {chatLoading ? <Spin /> : (
                                messages?.map((msg, index) => {
                                    const isMyMessage = msg.senderId === id;
                                    return (
                                        <Card
                                            bodyStyle={{ padding: '8px 12px' }}
                                            style={{ backgroundColor: isMyMessage ? primaryColor : undefined, color: isMyMessage ? myColor : undefined, width: 'fit-content', alignSelf: isMyMessage ? 'flex-end' : 'flex-start' }}
                                            key={msg.id}
                                            title={<div style={{ textAlign: isMyMessage ? 'right' : 'left', color: isMyMessage ? myColor : undefined }}>
                                                {isMyMessage ? "You" : selectedUser?.name}
                                            </div>}
                                        >
                                            <Typography style={{ color: isMyMessage ? myColor : undefined, margin: 0, padding: 0 }}>{msg.message}</Typography>
                                            <div style={{ textAlign: 'right' }}><small>{dayjs(msg.sentAt).format("DD.MM.YY HH:mm:ss")}</small></div>
                                        </Card>
                                    );
                                }))
                            }
                        </div>
                        {selectedUser && (
                            <Form form={form} layout="inline" onFinish={onFinished} style={{ marginTop: '20px', display: 'flex', width: '100%' }}>
                                <Form.Item style={{ flex: 1, marginRight: '10px' }}>
                                    <Input
                                        required
                                        name="message"
                                        placeholder="Type a message"
                                    />
                                </Form.Item>
                                <Form.Item>
                                    <Button type="primary" htmlType="submit">Send</Button>
                                </Form.Item>
                            </Form>
                        )}
                    </Content>
                </Layout>
            </Layout>
        </WSConnectionProvider>
    );
};
