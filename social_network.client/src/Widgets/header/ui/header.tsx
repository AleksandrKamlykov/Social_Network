import React from 'react';
import { Layout, Menu } from 'antd';
import { UserOutlined, HomeOutlined, MessageOutlined } from '@ant-design/icons';

const { Header } = Layout;

export const AppHeader: React.FC = () => {
    return (
        <Header>
            <div className="logo" />
            <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']}>
                <Menu.Item key="1" icon={<HomeOutlined />}>
                    Home
                </Menu.Item>
                <Menu.Item key="2" icon={<UserOutlined />}>
                    Profile
                </Menu.Item>
                <Menu.Item key="3" icon={<MessageOutlined />}>
                    Messages
                </Menu.Item>
            </Menu>
        </Header>
    );
};

