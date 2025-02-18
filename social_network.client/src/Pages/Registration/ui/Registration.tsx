import React from 'react';
import { Form, Input, Button, DatePicker } from 'antd';
import { FormInstance } from 'antd';
import { IUser } from '@/Enteties/user/types';
import { useRequest } from '@/Shared/api/useRequest';
import { Link } from 'react-router-dom';
import { pathes } from '@/App/router/pathes';
import dayjs from 'dayjs';


export const Registration: React.FC = () => {
    const [form] = Form.useForm();

    const {post,loading} = useRequest()

    const onFinish = async (values: IUser) => {
        console.log('Received values from form: ', values);
        values.birthDate = dayjs(values.birthDate).format('YYYY-MM-DD')
        await post('User/register', values)
    };

    return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <div style={{ maxWidth: '300px', margin: '0 auto', padding: '50px' }}>
        <h1>Registration</h1>
        <Link to={pathes.auth.absolute}>Auth</Link>
          <Form
          disabled={loading}
            form={form}
            name="register"
            onFinish={onFinish}
            initialValues={{ remember: true }}
            layout="vertical"
        >
            <Form.Item
                name="name"
                label="Name"
                rules={[{ required: true, message: 'Please input your username!' }]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                name="nickName"
                label="Nickname"
                rules={[{ required: true, message: 'Please input your username!' }]}
            >
                <Input />
            </Form.Item>
            <Form.Item
            
                name="birthDate"
                label="BirthDate"
                rules={[{ required: true, message: 'Please input your BirthDate!' }]}
                
            >
                <DatePicker  />
            </Form.Item>


            <Form.Item
                name="email"
                label="Email"
                rules={[{ required: true, message: 'Please input your email!', type: 'email' }]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                name="password"
                label="Password"
                rules={[{ required: true, message: 'Please input your password!' }]}
            >
                <Input.Password />
            </Form.Item>

            <Form.Item>
                <Button loading={loading} type="primary" htmlType="submit">
                    Register
                </Button>
            </Form.Item>
        </Form>
      </div>
    </div>
    );
};