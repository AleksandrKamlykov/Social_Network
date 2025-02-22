import { useRequestData } from '@/Shared/api/useRequestData';
import React, { useEffect } from 'react';
import { IAttacment } from './types';
import { Col, Row, Spin } from 'antd';

interface AudioProps {
    userId: string;
}

export const AudioAttacments: React.FC<AudioProps> = ({ userId }) => {

    const { data, loading, get } = useRequestData<IAttacment[]>();

    useEffect(() => {
        get(`Attacments/${userId}`);
    }
        , [userId]);

    if (loading) {
        return <Spin />;
    }


    return (
        <Row gutter={[16, 16]}>
            {data?.map((attacment) => (
                <Col key={attacment.id} xs={24} >
                    <audio controls>
                        <source src={attacment.base64Data} type="audio/mpeg" />
                        Your browser does not support the audio element.
                    </audio>
                </Col>
            ))}
        </Row>

    );
};

