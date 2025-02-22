import React from 'react';
import { Layout, Card, Avatar, Row, Col } from 'antd';
import { Posts } from '@/Widgets/posts/ui/posts';
import { Followers } from '@/Widgets/followers/ui/followers';
import { ProfileProvider, useProfile } from '../../../context/profileContext/profileContext';

const { Content } = Layout;

const ProfileContent: React.FC = () => {
    const { profile, loading } = useProfile();

    if (loading) return <p>Loading...</p>;
    if (!profile) return <p>User not found</p>;

    const { id, name, email, birthDate, nickname } = profile;

    return (
        <Content style={{ padding: '20px' }}>
            <Row gutter={[16, 16]}>
                <Col span={8}>
                    <Row gutter={[16, 16]}>
                        <Col span={24}>
                            <Card title={name}>
                                <Avatar size={64} src="https://via.placeholder.com/150" />
                                <p>Nickname: {nickname}</p>
                                <p>Email: {email}</p>
                                <p>Birth Date: {birthDate}</p>
                                <p>Location: New York, USA</p>
                            </Card>
                        </Col>
                        <Col span={24}>
                            <Followers userId={id} />
                        </Col>
                    </Row>
                </Col>
                <Col span={16}>
                    <Card title="Gallery" style={{ marginBottom: '16px' }}>
                        <Row gutter={[16, 16]}>
                            <Col span={8}>
                                <img src="https://picsum.photos/200/300" alt="Gallery Item" />
                            </Col>
                            <Col span={8}>
                                <img src="https://picsum.photos/200/300" alt="Gallery Item" />
                            </Col>
                            <Col span={8}>
                                <img src="https://picsum.photos/200/300" alt="Gallery Item" />
                            </Col>
                        </Row>
                    </Card>
                    <Card title="Posts">
                        <Posts userId={id} />
                    </Card>
                </Col>
            </Row>
        </Content>
    );
};

export const Profile: React.FC = () => {
    return (
        <ProfileProvider>
            <ProfileContent />
        </ProfileProvider>
    );
};