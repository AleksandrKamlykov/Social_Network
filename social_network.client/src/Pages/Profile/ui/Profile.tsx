import React, { useState } from 'react';
import {Layout, Card, Avatar, Row, Col, Tabs, Button, Modal, Form, Upload, message, Image} from 'antd';
import { UploadOutlined, UserOutlined } from '@ant-design/icons';
import { Posts } from '@/Widgets/posts/ui/posts';
import { Followers } from '@/Widgets/followers/ui/followers';
import { ProfileProvider, useProfile } from '../../../context/profileContext/profileContext';
import { Gallery } from '@/Widgets/attacments/images';
import { AudioAttacments } from '@/Widgets/attacments/audio';
import {handleAttachment} from "../../../../utils/handleAttacjmentFromForm.ts";
import {useRequest} from "@/Shared/api/useRequest.ts";

const { Content } = Layout;

const ProfileContent: React.FC = () => {
    const { profile, loading , IS_SAME, updateAvatar} = useProfile();
    const [currentTab, setCurrentTab] = useState('posts');
    const [isModalVisible, setIsModalVisible] = useState(false);

    const {  post,loading: createLoading } = useRequest();

    const [form] = Form.useForm();

    if (loading) return <p>Loading...</p>;
    if (!profile) return <p>User not found</p>;

    const { id, name, email, birthDate, nickname, avatar } = profile;

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };



    const handleAddAvatar = async (values: any) => {

        const payload = await handleAttachment(values, "image");
        console.log(payload);

        try {
            const response = await post('Attachments/avatar', payload);
            if (response.status === 200) {
                message.success('Picture uploaded successfully');
                setIsModalVisible(false);
                updateAvatar(payload.base64Data)

            } else {
                message.error('Failed to upload picture');
            }
        } catch (error) {
            message.error('An error occurred while uploading the picture');
        } finally {
            form.resetFields();

        }

    };

    return (
        <Content style={{ padding: '20px' }}>
            <Row gutter={[16, 16]}>
                <Col span={8}>
                    <Row gutter={[16, 16]}>
                        <Col span={24}>
                            <Card title={name}>
                                <div style={{ textAlign: 'center' }}>
                                    {avatar ? (
                                    <Image src={avatar} alt="Avatar" style={{ width: '100%' }} />
                                    ) : (
                                    <Avatar size={240} icon={<UserOutlined />} />
                                    )}
                                </div>
                                <p>Nickname: {nickname}</p>
                                <p>Email: {email}</p>
                                <p>Birth Date: {birthDate}</p>
                                <p>Location: New York, USA</p>
                                { IS_SAME && (
                                <Button type="primary" onClick={showModal}>
                                    Update Avatar
                                </Button>
                                    )}
                            </Card>
                        </Col>
                        <Col span={24}>
                            <Followers userId={id} />
                        </Col>
                    </Row>
                </Col>
                <Col span={16}>
                    <Card>
                        <Tabs activeKey={currentTab} onChange={setCurrentTab} centered type="line" size="large">
                            <Tabs.TabPane tab="Posts" key="posts">
                                <Posts userId={id} />
                            </Tabs.TabPane>
                            <Tabs.TabPane tab="Pictures" key="pictures">
                                <Gallery userId={id} isOpen={currentTab === "pictures"} />
                            </Tabs.TabPane>
                            <Tabs.TabPane tab="Audio" key="audios">
                                <AudioAttacments userId={id} isOpen={currentTab === "audios"} />
                            </Tabs.TabPane>
                        </Tabs>
                    </Card>
                </Col>
            </Row>
            <Modal title="Update Avatar" visible={isModalVisible} onCancel={handleCancel} footer={null}>

                    <Form form={form} disabled={createLoading} onFinish={handleAddAvatar}>
                        <Form.Item
                            name="attachment"
                            valuePropName="fileList"
                            getValueFromEvent={(e) => (Array.isArray(e) ? e : e && e.fileList)}
                            rules={[{ required: true, message: 'Please upload a picture!' }]}
                        >
                            <Upload name="attachment" listType="picture" beforeUpload={() => false}>
                                <Button icon={<UploadOutlined />}>Click to Upload</Button>
                            </Upload>
                        </Form.Item>
                        <Form.Item>
                            <Button loading={createLoading} type="primary" htmlType="submit">
                                Add Picture
                            </Button>
                        </Form.Item>
                    </Form>

            </Modal>
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