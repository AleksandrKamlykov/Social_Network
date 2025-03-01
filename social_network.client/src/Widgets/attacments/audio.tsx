import React, { useState, useEffect } from 'react';
import { useRequestData } from '@/Shared/api/useRequestData';
import { IAttachment } from './types';
import { Col, Row, Spin, Button, Form, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useRequest } from '@/Shared/api/useRequest';

interface AudioProps {
    userId: string;
    isOpen: boolean;
}

export const AudioAttacments: React.FC<AudioProps> = ({ userId ,isOpen}) => {
    const { data, loading, get } = useRequestData<IAttachment[]>();
    const { post, loading: uploadLoading } = useRequest();
    const [form] = Form.useForm();

    useEffect(() => {
        if(isOpen && userId){
            get(`Attachments/audios/${userId}`);
        }
    }, [userId,isOpen]);

    const handleUpload = async (values: any) => {
        const reader = new FileReader();
        reader.readAsDataURL(values.attachment[0].originFileObj);

        reader.onload = async () => {
            const base64Data = reader.result as string;
            const payload = {
                base64Data,
                type: 'audio',
                name: values.attachment[0].name,
                extension: values.attachment[0].type,
                description: values.description ?? 'Audio file',
            };

            try {
                const response = await post('Attachments/audio', payload);
                if (response.status === 200) {
                    message.success('Audio uploaded successfully');
                    get(`Attachments/audios/${userId}`);
                } else {
                    message.error('Failed to upload audio');
                }
            } catch (error) {
                message.error('An error occurred while uploading the audio');
            } finally {
                form.resetFields();
            }
        };

        reader.onerror = () => {
            message.error('Failed to read file');
        };
    };

    if (loading) {
        return <Spin />;
    }

    return (
        <div>
            <Form form={form} onFinish={handleUpload}>
                <Form.Item
                    name="attachment"
                    valuePropName="fileList"
                    getValueFromEvent={(e) => (Array.isArray(e) ? e : e && e.fileList)}
                    rules={[{ required: true, message: 'Please upload an audio file!' }]}
                >
                    <Upload name="attachment" listType="text" beforeUpload={() => false}>
                        <Button icon={<UploadOutlined />}>Click to Upload</Button>
                    </Upload>
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={uploadLoading}>
                        Submit
                    </Button>
                </Form.Item>
            </Form>
            <Row gutter={[16, 16]}>
                {data?.map((attachment) => (
                    <Col key={attachment.id} xs={24}>
                        <audio controls style={{ width: '100%' }}>
                            <source src={attachment.base64Data} type="audio/mpeg" />
                            Your browser does not support the audio element.
                        </audio>
                    </Col>
                ))}
            </Row>
        </div>
    );
};