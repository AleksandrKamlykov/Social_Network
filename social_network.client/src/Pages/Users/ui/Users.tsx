import { useAppSelector } from "@/App/store/AppStore";
import { IUser } from "@/Enteties/user/types";
import { useRequestData } from "@/Shared/api/useRequestData";
import { UsersList } from "@/Widgets/usersList/ui/UsersList";
import {Button, Col, Form, Input, Layout, Row} from "antd";
import React, { useEffect } from "react";
import {useRequest} from "@/Shared/api/useRequest.ts";


type UsersContextType = {
    followers: string[];
    follow: (userId: string) => void;
    unFollow: (userId: string) => void;
}


const  UsersListContext = React.createContext<UsersContextType>({
    followers: [],
    follow: () => {},
    unFollow: () => {},
});

export const Users: React.FC = () => {
    const { id } = useAppSelector(state => state.user);

    const [form] = Form.useForm();

    const { data: users, get } = useRequestData<IUser[]>();
    const { get: getFollowers } = useRequest<string[]>();

    const [followerIds, setFollowerIds] = React.useState<string[]>([]);

    const fetchUsers = async (search?: string) => {
        await get('User/users' + (search ? `?search=${search}` : ''));
    };

    const onFinish = async ({ value }: { value: string; }) => {
        await fetchUsers(value);
    };


    const fetchFollowers = async () => {
       const res = await getFollowers(`Followers/${id}`);

         setFollowerIds(res.data);
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


    function follow(userId: string) {
        setFollowerIds([...followerIds, userId]);
    }
    function unFollow(userId: string) {
        setFollowerIds(followerIds.filter(id => id !== userId));

    }

    return (
        <Layout style={{ maxWidth: '800px', margin: '0 auto', padding: '50px' }}>
            <Form layout="horizontal" form={form} onFinish={onFinish}>
                <Row gutter={[16, 16]}>
                    <Col span={20}>
                        <Form.Item name="value">
                            <Input placeholder="Search users" />
                        </Form.Item>
                    </Col>
                    <Col span={4}>
                        <Form.Item>
                            <Button style={{width:"100%"}} type="primary" htmlType="submit">
                                Search
                            </Button>
                        </Form.Item>
                    </Col>
                </Row>


            </Form>
            <UsersListContext.Provider value={{ followers: followerIds, follow, unFollow }}>
                <UsersList users={users ?? []} followers={followerIds ?? []} />
            </UsersListContext.Provider>
        </Layout>
    );
};

export const useUsersContext = () => React.useContext(UsersListContext);