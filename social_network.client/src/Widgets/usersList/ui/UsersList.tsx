import { pathes } from "@/App/router/pathes";
import { IUser } from "@/Enteties/user/types";
import { pathRouterBuilder } from "@/Shared/utils/pathRouterBuilder";
import { Avatar, Button, List, Space, Typography } from "antd";
import { NavLink } from "react-router-dom";
import { UserAddOutlined } from "@ant-design/icons";
import { useRequest } from "@/Shared/api/useRequest";

type UsersListProps = {
    users: IUser[];
    followers: string[];
};

export const UsersList: React.FC<UsersListProps> = ({ users, followers }) => {
    return (
        <List
            itemLayout="horizontal"
            dataSource={users}
            renderItem={user => <UserItem user={user} followers={followers} />}
        />
    );
};

const UserItem: React.FC<{ user: IUser; followers: string[]; }> = ({ user, followers }) => {
    const { name, nickname, email } = user;

    const { loading, post } = useRequest();

    const follow = async () => {
        await post(`Followers/follow`, { follow: user.id });
    };

    const unfollow = async () => {
        await post(`Followers/unfollow`, { follow: user.id });
    };

    const isFollowed = followers.includes(user.id);

    return (
        <List.Item>
            <List.Item.Meta
                avatar={<Avatar src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${nickname}`} />}
                title={<NavLink to={pathRouterBuilder(pathes.profile.absolute, { nickname })}>{name}</NavLink>}
                description={
                    <Space>
                        <Typography.Text>{`Nickname: ${nickname}`}</Typography.Text>
                        <Typography.Text>{`email: ${email}`}</Typography.Text>
                    </Space>
                }
            />
            {isFollowed ?
                <Button type="primary" loading={loading} onClick={unfollow}>Unfollow</Button>
                : <Button type="primary" loading={loading} onClick={follow}>Follow</Button>}
        </List.Item>
    );
};