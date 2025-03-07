import { pathes } from "@/App/router/pathes";
import { IUser } from "@/Enteties/user/types";
import { pathRouterBuilder } from "@/Shared/utils/pathRouterBuilder";
import {Avatar, Button, List, Modal, Space, Typography} from "antd";
import { NavLink } from "react-router-dom";
import { useRequest } from "@/Shared/api/useRequest";
import React, {ReactNode, useEffect, useState} from "react";
import {useUsersContext} from "@/Pages/Users/ui/Users.tsx";
import {MessageOutlined, UserAddOutlined, UserDeleteOutlined} from "@ant-design/icons";
import { Spin } from "antd";
import {SendMessageForm} from "@/features/sendMessageForm";

type UsersListProps = {
    users: IUser[];
    followers: string[];
};

export const UsersList: React.FC<UsersListProps> = ({ users, followers }) => {

    const { loading: loadingSendMessage, post } = useRequest();

const [selectedUser, setSelectedUser] = useState<IUser | null>(null);

async function sendMessage(message: string) {
        const res = await post(`chat/message/send/${selectedUser?.id}`, { messageText:message });
}

    return (
      <>
          <List
              itemLayout="horizontal"
              dataSource={users}
              renderItem={user => <UserItem user={user} followers={followers} extra={<>
                  <Button type={"primary"} icon={<MessageOutlined />} onClick={()=>setSelectedUser(user)}>
                      Send Message
                  </Button>
              </>} />}
          />

          <Modal
              title={`Send Message to ${selectedUser?.name}`}
              open={Boolean(selectedUser)}
              onCancel={() => setSelectedUser(null)}
              footer={null}
          >
              <SendMessageForm onSendMessage={sendMessage} loading={loadingSendMessage} />
          </Modal>
      </>
    );
};

const UserItem: React.FC<{ user: IUser; followers: string[]; extra:ReactNode }> = ({ user, followers, extra }) => {

    const {follow, unFollow}= useUsersContext();
    const [avatarBase64, setAvatarBase64] = React.useState<string | null>(null);


    const { name, nickname, email } = user;

    const { loading, post } = useRequest();
    const { loading:loadingAvatar, get } = useRequest();


    const fetchAvatar = async () => {
        const { data, status } = await get(`Attachments/${user.avatarId}`);
        if (status === 200 && data.base64Data) {
            setAvatarBase64(data.base64Data);
        }
    }


    useEffect(() => {
        if(user?.avatarId){
            fetchAvatar();
        }
    }, [user]);

    const followFetch = async () => {
       const {data,status}= await post(`Followers/follow`, { follow: user.id });
        if(status === 200 && data.id){
            follow(user.id);
        }
    };

    const unfollowFetch = async () => {
        const {status}=await post(`Followers/unfollow`, { follow: user.id });

        if(status===200 ){
            unFollow(user.id);

        }
    };

    const isFollowed = followers.includes(user.id);

    const sharedBtnProps = {
        loading,
        onClick: isFollowed ? unfollowFetch : followFetch,
        icon: isFollowed ? <UserDeleteOutlined/> : <UserAddOutlined/>,
        type: "primary",
        danger: isFollowed,
        children: isFollowed ? "Unfollow" : "Follow",
        style:{
            width: 110
        }
    }

    return (
        <List.Item>
            <List.Item.Meta
                avatar={loadingAvatar ? <Spin/> : <Avatar  src={ avatarBase64 ??`https://api.dicebear.com/7.x/miniavs/svg?seed=${nickname}`} />}
                title={<NavLink to={pathRouterBuilder(pathes.profile.absolute, { nickname })}>{name}</NavLink>}
                description={
                    <Space>
                        <Typography.Text>{`Nickname: ${nickname}`}</Typography.Text>
                        <Typography.Text>{`email: ${email}`}</Typography.Text>
                    </Space>
                }
            />
           <div style={{display: "flex", gap:20, alignItems:"center"}}>
               {isFollowed ?
                   <Button {...sharedBtnProps}/>
                   : <Button {...sharedBtnProps}/>}

               {extra}
           </div>
        </List.Item>
    );
};