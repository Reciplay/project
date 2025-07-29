'use client';

import styles from './overview.module.scss';
import React, { useEffect, useState } from 'react';
import { Avatar, List } from 'antd';

interface DataType {
    gender?: string;
    name?: string;
    email?: string;
    avatar?: string;
    id?: string;
}

export default function Overview() {
    const [data, setData] = useState<DataType[]>([]);

    useEffect(() => {
        const mockData: DataType[] = [
            {
                id: '1',
                name: '총 수강생 수',
                email: '200',
                avatar: 'https://randomuser.me/api/portraits/men/1.jpg'
            },
            {
                id: '2',
                name: '평균별점',
                email: '4.5',
                avatar: 'https://randomuser.me/api/portraits/lego/1.jpg'
            },
            {
                id: '3',
                name: '총 리뷰수',
                email: '218',
                avatar: 'https://randomuser.me/api/portraits/lego/2.jpg'
            },
            {
                id: '4',
                name: '구독자 수',
                email: '1029',
                avatar: 'https://randomuser.me/api/portraits/lego/3.jpg'
            },
        ];
        setData(mockData);
    }, []);

    return (
        <div className={styles.divTag}>
            <div
                style={{
                    height: 250,
                    overflow: 'auto',
                    padding: '0 56px',
                    margin: '0 auto', // ✅ 수평 중앙 정렬
                }}
            >
                <List
                    dataSource={data}
                    renderItem={(item) => (
                        <List.Item key={item.id}>
                            <List.Item.Meta
                                title={<a href="#">{item.name}</a>}
                            />
                            <div>{item.email}</div>
                        </List.Item>
                    )}
                />
            </div>
        </div>
    );
}
