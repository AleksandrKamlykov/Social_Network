import React, { useEffect } from 'react';
import { Row, Col, Spin, Image } from 'antd';
import { useRequestData } from '@/Shared/api/useRequestData';
import { IAttacment } from './types';

interface GalleryProps {
    userId: string;
}


export const Gallery: React.FC<GalleryProps> = ({ userId }) => {
    const { data, loading, get } = useRequestData<IAttacment[]>();

    useEffect(() => {
        get(`Attacments/${userId}`);
    }, [userId]);


    if (loading) {
        return <Spin />;
    }

    return (
        <Row gutter={[16, 16]}>
            {data?.map((attacment) => (
                <Col key={attacment.id} xs={24} sm={12} md={8} lg={6}>
                    <Image src={`data:image/jpeg;base64,${attacment.base64Data}`} alt={`Image ${attacment.id}`} style={{ width: '100%' }} />
                </Col>
            ))}
        </Row>
    );
};