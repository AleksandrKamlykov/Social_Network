import React, { useEffect } from 'react';
import { Form, Input, Button, message } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { pathes } from '@/App/router/pathes';
import { useRequest } from '@/Shared/api/useRequest';
import { IUser } from '@/Enteties/user/types';
import { useAppDispatch } from '@/App/store/AppStore';
import { pathRouterBuilder } from '@/Shared/utils/pathRouterBuilder';
import { addUser } from '@/Enteties/user/userSlice';

export const AuthPage: React.FC = () => {
    const { post,get,loading } = useRequest<IUser>();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const onFinish = async (values: IUser) => {
        const res = await post('User/login', values);
        if (res.status === 200) {
            await whoAmI();
        }
    };

    async function whoAmI() {
       
        const {data,status} = await get('User/whoami');


        if (status === 200 && data.id) {
            dispatch(addUser(data));
            navigate(pathRouterBuilder(pathes.home.absolute));
        }
    }

    useEffect(() => {
       
            whoAmI();
        
    }, []);

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <div style={{ maxWidth: '300px', margin: '0 auto', padding: '50px' }}>
            <h1>Auth</h1>
            <Link to={pathes.registration.absolute}>Registration</Link>
            <Form
                disabled={loading}
                
                name="auth"
                initialValues={{ remember: true }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
            >
                <Form.Item
                    label="Nickname"
                    name="Username"
                    rules={[{ required: true, message: 'Please input your nickname!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Password"
                    name="password"
                    rules={[{ required: true, message: 'Please input your password!' }]}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading}>
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};