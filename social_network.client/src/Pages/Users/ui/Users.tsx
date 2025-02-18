import { useAppSelector } from "@/App/store/AppStore";
import { IUser } from "@/Enteties/user/types";
import { useRequestData } from "@/Shared/api/useRequestData";
import { UsersList } from "@/Widgets/usersList/ui/UsersList";
import { Button, Form, Input, Layout } from "antd";
import { useEffect } from "react";

export const Users: React.FC = () => {
    const { id } = useAppSelector(state => state.user);

    const [form] = Form.useForm();

    const { data: users, get } = useRequestData<IUser[]>();
    const { data: followerIds, get: getFollowers } = useRequestData<string[]>();

    const fetchUsers = async (search?: string) => {
        await get('User/users' + (search ? `?search=${search}` : ''));
    };

    const onFinish = async ({ value }: { value: string; }) => {
        await fetchUsers(value);
    };


    const fetchFollowers = async () => {
        await getFollowers(`Followers/${id}`);
    };

    const initData = async () => {
        fetchUsers();
        fetchFollowers();
    };

    useEffect(() => {
        if (id) {
            initData();
        }
    }
        , [id]);

    return (
        <Layout style={{ maxWidth: '800px', margin: '0 auto', padding: '50px' }}>
            <Form layout="horizontal" form={form} onFinish={onFinish}>
                <Form.Item name="value">
                    <Input placeholder="Search users" />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Search
                    </Button>
                </Form.Item>
            </Form>
            <UsersList users={users ?? []} followers={followerIds ?? []} />
        </Layout>
    );
};