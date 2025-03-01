import { pathes } from "@/App/router/pathes";
import { IUser } from "@/Enteties/user/types";
import { useRequestData } from "@/Shared/api/useRequestData";
import { pathRouterBuilder } from "@/Shared/utils/pathRouterBuilder";
import {Avatar, Card, Col, Row, Space, Spin} from "antd";
import React, { useEffect } from "react";
import { NavLink } from "react-router-dom";
import {useRequest} from "@/Shared/api/useRequest.ts";

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
               <Follower follower={follower}    />
            </Col>))}
        </Row>
    </Card>;
};

const Follower: React.FC<{ follower: IUser }> = ({ follower }) => {

    const [avatarBase64, setAvatarBase64] = React.useState<string | null>(null);



    const { loading:loadingAvatar, get } = useRequest();


    const fetchAvatar = async () => {
        const { data, status } = await get(`Attachments/${follower.avatarId}`);
        if (status === 200 && data.base64Data) {
            setAvatarBase64(data.base64Data);
        }
    }

    useEffect(() => {
        if(follower?.avatarId){
            fetchAvatar();
        }
    }, []);



    return( <Card
        style={{ padding: 0 }}
        bodyStyle={{ padding: 12 }}
    >
        <Space>
            <div style={{ width: 50, height: 50 }}>
                {
                    loadingAvatar? <Spin/> : avatarBase64 ? <Avatar src={avatarBase64} /> : <Avatar>{follower.name[0]}</Avatar>
                }
            </div>
            <Card.Meta
                title={<NavLink to={pathRouterBuilder(pathes.profile.absolute, { nickname: follower.nickname })}>
                    {follower.name}
                </NavLink>
                }
                description={follower.nickname} />
        </Space>
    </Card>)
}