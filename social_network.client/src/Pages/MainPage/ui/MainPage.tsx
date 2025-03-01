import React, {useEffect} from 'react';
import {useRequestData} from "@/Shared/api/useRequestData.ts";
import {PostItem} from "@/Enteties/post/ui/post.tsx";
import {CommentsList} from "@/Widgets/comments/ui/comments.tsx";
import {Post} from "@/Enteties/post/types.ts";
import {Avatar, Spin, Typography} from "antd";
import {useRequest} from "@/Shared/api/useRequest.ts";
import {NavLink} from "react-router-dom";
import {pathRouterBuilder} from "@/Shared/utils/pathRouterBuilder.ts";
import {pathes} from "@/App/router/pathes.ts";

export const MainPage: React.FC = () => {

    const {data,get}= useRequestData<Post[]>()


    useEffect(() => {
        get('Posts/feed')
    }, []);

    return (
        <div style={{display:"flex", flexDirection:"column", gap:20}}>
            <h1>Main Page</h1>
            {data?.map(post =><FeedItem post={post} />)}
        </div>
    );
};

const FeedItem: React.FC<{ post: Post }> = ({ post }) => {

    const [avatarBase64, setAvatarBase64] = React.useState<string | null>(null);

    const { loading:loadingAvatar, get } = useRequest();

    const fetchAvatar = async () => {
        const { data, status } = await get(`Attachments/${post.userAvatarId}`);
        if (status === 200 && data.base64Data) {
            setAvatarBase64(data.base64Data);
        }
    }

    useEffect(() => {
        if(post?.userAvatarId){
            fetchAvatar();
        }
    }, []);


    return(<PostItem key={post.id} post={post}  head={(post) => <div style={{ display: 'flex', gap:20 }}>
        <div style={{ height:50, width:50 }}>
            {
                loadingAvatar ? <Spin />: avatarBase64 ? <Avatar src={avatarBase64} /> : <Avatar>{post.userName[0]}</Avatar>
            }
        </div>
        <NavLink to={pathRouterBuilder(pathes.profile.absolute,{nickname: post.userNickName})}  >{post.userName}</NavLink>
    </div>}>
        <CommentsList postId={post.id} />
    </PostItem>)
}