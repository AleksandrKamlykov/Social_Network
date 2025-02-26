import React, { useEffect } from 'react';
import { Row, Col, Spin, Image, Form, Upload, Button, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useRequestData } from '@/Shared/api/useRequestData';
import { IAttachment } from './types';
import { useProfile } from '@/context/profileContext/profileContext';
import { useRequest } from '@/Shared/api/useRequest';

interface GalleryProps {
    userId: string;
    isOpen: boolean
}

export const Gallery: React.FC<GalleryProps> = ({ userId, isOpen }) => {
    const { data, loading, get } = useRequestData<IAttachment[]>();

    const [form] = Form.useForm();

    const { post, loading: createLoading } = useRequest();

    const { IS_SAME } = useProfile();

    useEffect(() => {
        if (isOpen && userId &&  !data) {
            fetchGallery(userId);
        }
    }, [isOpen, userId]);

    const fetchGallery = async (userId:string) => {
        await get(`Attachments/pictures/${userId}`);
    }

    if (loading) {
        return <Spin />;
    }

    const handleAddPicture = async (values: any) => {
        const reader = new FileReader();
        reader.readAsDataURL(values.picture[0].originFileObj);
        reader.onload = async () => {
            const base64Data = reader.result as string;
            const payload: Omit<IAttachment, "id" | "createdAt"> = {
                    base64Data:base64Data,
                    type: "image",
                    name: values.picture[0].name,
                    extension: values.picture[0].type,
                    description: 'Profile picture',

            };

            try {
                const response = await post('Attachments/addPicture', payload);
                if (response.status === 201) {
                    message.success('Picture uploaded successfully');
                    fetchGallery(userId); // Refresh the gallery
                } else {
                    message.error('Failed to upload picture');
                }
            } catch (error) {
                message.error('An error occurred while uploading the picture');
            } finally {
                form.resetFields();
            }
        };
    };

    return (
        <>
            <div>
                <Button type="primary" onClick={()=>fetchGallery(userId)}>Refresh</Button>
            </div>
            {IS_SAME && (
                <Form form={form} disabled={createLoading} onFinish={handleAddPicture}>
                    <Form.Item
                        name="picture"
                        valuePropName="fileList"
                        getValueFromEvent={(e) => (Array.isArray(e) ? e : e && e.fileList)}
                        rules={[{ required: true, message: 'Please upload a picture!' }]}
                    >
                        <Upload name="picture" listType="picture" beforeUpload={() => false}>
                            <Button icon={<UploadOutlined />}>Click to Upload</Button>
                        </Upload>
                    </Form.Item>
                    <Form.Item>
                        <Button loading={createLoading} type="primary" htmlType="submit">
                            Add Picture
                        </Button>
                    </Form.Item>
                </Form>
            )}

            <Row gutter={[16, 16]}>
                {data?.map((attachment) => (
                    <Col key={attachment.id} xs={24} sm={12} md={8} lg={6}>
                        <Image src={`${attachment.base64Data}`} alt={`Image ${attachment.id}`} style={{ width: '100%' }} />
                    </Col>
                ))}
            </Row>
        </>
    );
};