import React, { useState, useEffect } from 'react';
import { useRequestData } from '@/Shared/api/useRequestData.ts';
import { useAppSelector } from '@/App/store/AppStore.ts';
import { IUser } from '@/Enteties/user/types.ts';
import { useRequest } from '@/Shared/api/useRequest.ts';
import { Button, Card, Form, Input, Layout, List, Spin, Typography } from "antd";
import dayjs from "dayjs";
import { theme } from 'antd';
import { ServerConnectionProvider, useServerConnection } from '@/Contexts/ServerConnectionContext.tsx';
import { UserListItem } from '@/Enteties/user/ui/userListItem';
import {toLowerFirsLetterInObj} from "../../../../utils/toLowerFirsLetterInObj.ts";

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

export const ChatPage = () => {

    const [form] = Form.useForm();

    const { id, name } = useAppSelector(state => state.user);
    const connection = useServerConnection();
    const [messages, setMessages] = useState<any[]>([]);
    const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
    const [chatRoomId, setChatRoomId] = useState<string | null>(null);

    const { data: chats, loading: usersLoading, get: fetchChats } = useRequestData<IUser[]>();



    const {post: sendMessageRequest, loading:loadingSendMessage} = useRequest();


    const { get: fetchChatHistory, loading: chatLoading } = useRequest();
    // const { loading: chatRoomLoading, get: fetchChatRoom } = useRequest();

    const fetchUsers = async () => {
      const res =  await fetchChats(`chat/chat-users/${id}`);


    };


    async function fetchAllMessages() {
        if (selectedUser) {
            const res = await fetchChatHistory(`chat/messages/${selectedUser.id}`);

            setMessages(res.data);
        }
    }

    useEffect(() => {
        if(selectedUser){
            fetchAllMessages();
        }
    }, [selectedUser]);

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        if (connection) {

            connection.addEventListener("message",event=>{
                const message = JSON.parse(event.data);
                const msg           = toLowerFirsLetterInObj(message);
                setMessages(messages => [msg, ...messages]);
            })

        }
    }, [connection]);



    const sendMessage = async (message: string, recieverId:string) => {


       try{
           const res = await sendMessageRequest(`chat/message/send/${recieverId}`,  { messageText:message });
           form.resetFields();
       }catch (e){
              console.error(e);
       }


    };

    const onFinished = async (values: any) => {

        if(!selectedUser) return;
        console.log("onFinished", values);

        await sendMessage(values.message, selectedUser.id);
    };

    const selectUser = async (user: IUser) => {
        setSelectedUser(user);

    };

    const { token } = theme.useToken();
    const primaryColor = token.colorPrimary;
    const myColor = token.colorTextLightSolid;
    const borderRadius = token.borderRadius;

    return (
        <ServerConnectionProvider>
            <Layout style={{ height: '80vh', padding: 0 }}>
                <Sider width={300} style={{ background: '#fff', padding: '20px' }}>
                    <Title level={3}>Chats</Title>
                    <List
                        loading={chatLoading}
                        itemLayout="horizontal"
                        dataSource={chats ?? []}
                        renderItem={chat => (
                            <List.Item onClick={() => {
                                selectUser(chat);
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
                                <UserListItem user={chat} />
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
                                messages?.map((msg) => {
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
                            <Form form={form} disabled={loadingSendMessage} layout="inline" onFinish={onFinished} style={{ marginTop: '20px', display: 'flex', width: '100%' }}>
                                <Form.Item name={"message"} style={{ flex: 1, marginRight: '10px' }}>
                                    <Input
                                        required
                                        name="message"
                                        placeholder="Type a message"
                                    />
                                </Form.Item>
                                <Form.Item>
                                    <Button loading={loadingSendMessage} type="primary" htmlType="submit">Send</Button>
                                </Form.Item>
                            </Form>
                        )}
                    </Content>
                </Layout>
            </Layout>
        </ServerConnectionProvider>
    );
};
