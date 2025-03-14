import React from 'react';
import { Button, Layout, Menu } from 'antd';
import { UserOutlined, HomeOutlined, LogoutOutlined, MessageOutlined } from '@ant-design/icons';
import { NavLink, useLocation } from 'react-router-dom';
import { pathes } from '@/App/router/pathes';
import { pathRouterBuilder } from '@/Shared/utils/pathRouterBuilder';
import { useAppDispatch, useAppSelector } from '@/App/store/AppStore';
import './header.css';
import { useRequest } from '@/Shared/api/useRequest';
import { removeUser } from '@/Enteties/user/userSlice';
import { Roles } from '@/Shared/models/roles';

const { Header } = Layout;

export const AppHeader: React.FC = () => {

    const { pathname } = useLocation();
    const dispatch = useAppDispatch();

    const nickname = useAppSelector(state => state.user.nickname);

    const { post, loading } = useRequest();

    const logout = async () => {
        const { status } = await post('User/logout');

        if (status === 200) {
            dispatch(removeUser());
            window.location.reload();
        };
    };



    const menuItems = [
        {
            key: pathes.home.absolute,
            icon: <HomeOutlined />,
            title: "Home",
            link: pathes.home.absolute,
            roles: [Roles.User]
        },
        {
            key: pathRouterBuilder(pathes.profile.absolute, { nickname }),
            icon: <UserOutlined />,
            title: `Profile: ${nickname}`,
            link: pathRouterBuilder(pathes.profile.absolute, { nickname }),
            roles: [Roles.User]

        },
        {
            key: pathes.users.absolute,
            icon: <UserOutlined />,
            title: `Users`,
            link: pathes.users.absolute,
            roles: [Roles.User]

        },
        {
            key: pathes.chat.id,
            icon: <MessageOutlined />,
            title: `Chat`,
            link: pathes.chat.absolute,
            roles: [Roles.User]
        },
        {
            key: pathes.admin.absolute,
            icon: <UserOutlined />,
            title: `Admin`,
            link: pathes.admin.absolute,
            roles: [Roles.Admin]

        },

    ];

    return (

        <Header className="header">
            <Menu theme="dark" mode="horizontal" selectedKeys={[pathname]} style={{ flex: 1 }}>
                {menuItems.map(item => (
                    <Menu.Item icon={item.icon} key={item.link}>
                        <NavLink to={item.link} >
                            {item.title}
                        </NavLink>
                    </Menu.Item>
                ))}
            </Menu>
            <Button type="text" style={{ color: "#EEE" }} icon={<LogoutOutlined />} onClick={logout}>Logout</Button>
        </Header>
    );
};

