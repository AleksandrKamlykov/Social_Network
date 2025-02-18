import { Post } from "../types";
import { Card } from 'antd';
import dayjs from "dayjs";
import { PropsWithChildren } from "react";

type PostItemProps = & PropsWithChildren & {
    post: Post;
    };

export const PostItem: React.FC<PostItemProps> = ({post,children}) => {
return (
    <Card className="post-item" >
        <p className="post-content">{post.content}</p>
        <div className="post-footer">
            <span className="post-date">{ dayjs(post.date).format("DD.MM.YYYY HH:mm:ss")}</span>
        </div>
        {children}
    </Card>
);

}