import { CommentItem } from "@/Enteties/comment/ui/comment";
import { useRequest } from "@/Shared/api/useRequest";
import { useRequestData } from "@/Shared/api/useRequestData";
import { Button, Collapse, List, Typography } from "antd";
import { Form, Input } from "antd";
import { useState } from "react";

const { Panel } = Collapse;

export const CommentsList: React.FC<{ postId: string; }> = ({ postId }) => {

  const { data, get, loading, reset } = useRequestData<Comment[]>();
  const { post } = useRequest<Comment[]>();



  async function fetchComments() {
    const response = await get(`Comments/${postId}`);

  }
  const [form] = Form.useForm();

  const onFinish = async (values: { Content: string; }) => {

    const response = await post('Comments/add', { ...values, PostId: postId });

    if (response.status === 200) {
      await fetchComments();
    }


    form.resetFields();
  };

  function toggleComments(id: string | undefined) {
    if (id) {
      fetchComments();
    } else {
      reset();
    }
  }


  return (
    <>

      <Collapse size="small" onChange={toggleComments}>
        <Panel header="Comments" key={postId} >
          <List dataSource={data ?? []}
            size="small"
            loading={loading}
            renderItem={comment => <CommentItem comment={comment} />}
          />
          <Form form={form} onFinish={onFinish}>
            <Form.Item
              name="Content"
              rules={[{ required: true, message: 'Please enter your comment!' }]}
            >
              <Input.TextArea rows={4} placeholder="Write a comment..." />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading}>
                Submit Comment
              </Button>
            </Form.Item>
          </Form>
        </Panel>

      </Collapse>

    </>




  );

};