import { manyUsers } from "@/moc/manyUsers";
import { useRequest } from "@/Shared/api/useRequest";
import { Button, Col, message, Row } from "antd";

export const Admin = () => {

    const { post, loading } = useRequest();

    async function addManyUsers() {
        const { status, data } = await post('User/load-many-users', manyUsers);

        if (status === 200) {
            message.success(`Added manyusers`);
        }

    }

    return <Row>
        <Col span={4}>
            <Button onClick={addManyUsers} loading={loading}>Add many users</Button>
        </Col>
    </Row>;
};