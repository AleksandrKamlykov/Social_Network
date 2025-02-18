import { CommentItem } from "@/Enteties/comment/ui/comment";
import { Post } from "@/Enteties/post/types";
import { PostItem } from "@/Enteties/post/ui/post";
import { useRequest } from "@/Shared/api/useRequest";
import { useRequestData } from "@/Shared/api/useRequestData";
import { CommentsList } from "@/Widgets/comments/ui/comments";
import { Button, Form, Input } from "antd";
import { useEffect } from "react";

type PostsProps = {
    userId: string;
};

export const Posts: React.FC<PostsProps> = ({userId}) => {

const {data: posts, error, loading,get} = useRequestData<Post[]>();
const {post} = useRequest<Post[]>();

async function fetchPosts() {
    await get(`Posts/${userId}`);
}

useEffect(() => {
    if(userId) {
        fetchPosts();
    }
}, [userId]);

async  function createPost(values: any) {
    await post('Posts/create', values);
    fetchPosts();
}


    return (
    <>
        <Form onFinish={createPost}>
            <Form.Item  name="Content" rules={[{ required: true, message: 'Please write a post!' }]}>
            <Input.TextArea placeholder="Write a post..." />
            </Form.Item>
            <Form.Item>
            <Button type="primary" htmlType="submit">Post</Button>
            </Form.Item>
        </Form>
        <div className="posts">
            {posts?.map(post => <PostItem key={post.id} post={post} >
                <CommentsList postId={post.id} />
            </PostItem>)}
        </div>
    </>
    );
}