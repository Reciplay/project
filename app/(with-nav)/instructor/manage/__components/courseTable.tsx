"use client"

import styles from './courseTable.module.scss'
import React, { useState } from 'react';
import { Table, Tooltip, Switch, Modal, Descriptions, Typography, Divider } from 'antd';

export default function CourseTable() {

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedLecture, setSelectedLecture] = useState<Lecture | null>(null);

    const handleLectureClick = (lecture: Lecture) => {
        setSelectedLecture(lecture);
        setIsModalVisible(true);
    };

    const { Paragraph, Title } = Typography;

    interface Lecture {
        key: string;
        order: string;
        date: string;
        title: string;
        teacher: string;
        description: string;
        isCanceled: boolean;
        isPrivated: boolean;
    }

    const columns = [
        {
            title: '순서',
            dataIndex: 'order',
            key: 'order',
            render: (text: string) => <a>{text}</a>,
            width: 60
            ,
        },
        {
            title: '날짜',
            dataIndex: 'date',
            key: 'date',
            width: 120,
        },
        {
            title: '강의명',
            dataIndex: 'title',
            key: 'title',
            ellipsis: {
                showTitle: false,
            },
            render: (_: string, record: Lecture) => (
                <Tooltip placement="topLeft" title={record.title}>
                    <a onClick={() => handleLectureClick(record)}>{record.title}</a>
                </Tooltip>
            ),
        },
        {
            title: '휴강여부',
            dataIndex: 'isCanceled',
            key: 'isCanceled',
            width: 120,
            render: (value: boolean) => <Switch defaultChecked={value} />,
        },
        {
            title: '공개여부',
            dataIndex: 'isPrivated',
            key: 'isPrivated',
            width: 120,
            render: (value: boolean) => <Switch defaultChecked={value} />,
        },


    ];
    const data: Lecture[] = [
        {
            key: '1',
            order: '1',
            date: '2025-03-12',
            title: '이탈리아 현지 미슐랭 요리사에게 배우는 파스타, 뇨끼, 리조또!',
            teacher: 'Giorgio Rossi',
            description: '현지 재료로 직접 만드는 이탈리아 대표 요리! 미슐랭 셰프의 비법 전수!',
            isCanceled: false,
            isPrivated: true,
        },
        {
            key: '2',
            order: '2',
            date: '2025-03-12',
            title: 'New York No. 1 Lake Park, New York No. 1 Lake Park',
            teacher: 'Emily Smith',
            description: '뉴욕 스타일 강의입니다.',
            isCanceled: false,
            isPrivated: true,
        },
    ];


    return (
        <>
            <Table columns={columns} dataSource={data} />
            <Modal
                title="강의 상세 정보"
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                onOk={() => setIsModalVisible(false)}
                width={600}
            >
                {selectedLecture && (
                    <>
                        <Title level={4}>{selectedLecture.title}</Title>
                        <Divider />
                        <Descriptions column={1} bordered size="small">
                            <Descriptions.Item label="날짜">{selectedLecture.date}</Descriptions.Item>
                            <Descriptions.Item label="강사명">{selectedLecture.teacher}</Descriptions.Item>
                            <Descriptions.Item label="휴강여부">
                                {selectedLecture.isCanceled ? '예정됨' : '정상 진행'}
                            </Descriptions.Item>
                            <Descriptions.Item label="공개여부">
                                {selectedLecture.isPrivated ? '공개' : '비공개'}
                            </Descriptions.Item>
                        </Descriptions>
                        <Divider />
                        <Paragraph>{selectedLecture.description}</Paragraph>
                    </>
                )}
            </Modal>
        </>
    )
}