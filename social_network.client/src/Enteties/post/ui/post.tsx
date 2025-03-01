import { Post } from "../types";
import {Card, Typography} from 'antd';
import dayjs from "dayjs";
import {PropsWithChildren, ReactNode} from "react";

type PostItemProps = & PropsWithChildren & {
    post: Post;
    head?: (post: Post) => ReactNode;
    };

export const PostItem: React.FC<PostItemProps> = ({post,children, head}) => {
return (
    <Card  >
        {head && head(post)}
        <Typography style={{fontSize:"1rem"}}>{post.content}</Typography>
        <div className="post-footer">
            <Typography style={{textAlign:"right", fontSize:"0.7rem"}}>{ dayjs(post.date).format("DD.MM.YYYY HH:mm:ss")}</Typography>
        </div>
        {children}
    </Card>
);

}