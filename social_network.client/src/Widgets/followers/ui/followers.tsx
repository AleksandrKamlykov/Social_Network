import { pathes } from "@/App/router/pathes";
import { IUser } from "@/Enteties/user/types";
import { useRequestData } from "@/Shared/api/useRequestData";
import { pathRouterBuilder } from "@/Shared/utils/pathRouterBuilder";
import { Avatar, Card, Col, Row, Space } from "antd";
import { useEffect } from "react";
import { NavLink } from "react-router-dom";

type FollowersProps = {
    userId: string;
};

export const Followers: React.FC<FollowersProps> = ({ userId }) => {


    const { data: followers, get } = useRequestData<IUser[]>();

    const fetchFollowers = async () => {
        const response = await get(`Followers/following/${userId}`);
    };

    useEffect(() => {
        if (userId) {
            fetchFollowers();
        }
    }
        , [userId]);


    return <Card title="Followers" bodyStyle={{ padding: 12 }}>
        <Row gutter={[8, 8]}>
            {followers?.map(follower => (<Col key={follower.id} span={12}>
                <Card
                    style={{ padding: 0 }}
                    bodyStyle={{ padding: 12 }}
                >
                    <Space>
                        <Avatar style={{ height: 50, width: 50 }} alt="example" src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${follower.nickname}`} />
                        <Card.Meta
                            title={<NavLink to={pathRouterBuilder(pathes.profile.absolute, { nickname: follower.nickname })}>
                                {follower.name}
                            </NavLink>
                            }
                            description={follower.nickname} />
                    </Space>
                </Card>
            </Col>))}
        </Row>
    </Card>;
};