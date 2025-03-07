import React from 'react';
import { Form, Input, Button } from 'antd';

interface MessageFormProps {
    onSendMessage: (message: string) => void;
    loading: boolean;
}

export const SendMessageForm: React.FC<MessageFormProps> = ({ onSendMessage, loading }) => {
    const [form] = Form.useForm();

    const onFinish = (values: { messageText: string }) => {
        onSendMessage(values.messageText);
        form.resetFields();
    };

    return (
        <Form form={form} layout="inline" onFinish={onFinish} style={{ display: 'flex', width: '100%' }}>
            <Form.Item name="messageText" style={{ flex: 1, marginRight: '10px' }}>
                <Input placeholder="Type a message" required />
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading}>Send</Button>
            </Form.Item>
        </Form>
    );
};