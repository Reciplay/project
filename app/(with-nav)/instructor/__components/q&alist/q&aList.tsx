'use client';

import React, { useState } from 'react';
import { Table, Tag, Space, Modal, Input, Button } from 'antd';
import type { TableProps } from 'antd';

const { TextArea } = Input;

interface DataType {
    key: string;
    name: string;
    date: string;    // ✅ 추가
    course: string;  // ✅ 추가
    tags: string[];
}

const QandAList = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState<DataType | null>(null);
    const [answer, setAnswer] = useState('');

    const showModal = (record: DataType) => {
        setCurrentQuestion(record);
        setIsModalOpen(true);
    };

    const handleOk = () => {
        console.log('답변 등록:', answer);
        setIsModalOpen(false);
        setAnswer('');
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setAnswer('');
    };

    const columns: TableProps<DataType>['columns'] = [
        {
            title: '질문',
            dataIndex: 'name',
            render: (text) => <a>{text}</a>,
        },
        {
            title: '작성일',
            dataIndex: 'date',
            render: (text) => <a>{text}</a>,
        },
        {
            title: '강좌명',
            dataIndex: 'course',
            render: (text) => <a>{text}</a>,
        },
        {
            title: '답변',
            key: 'tags',
            dataIndex: 'tags',
            render: (_, record) => (
                <Tag color="blue" onClick={() => showModal(record)} style={{ cursor: 'pointer' }}>
                    답변하기
                </Tag>
            ),
        },

    ];

    const data: DataType[] = [
        {
            key: '1',
            name: '이 강의에서 사용하는 재료는 어디서 구할 수 있나요?',
            date: '2025.07.29',
            tags: ['답변하기'],
            course: '한식 기초 마스터',
        },
        {
            key: '2',
            name: '요리 순서를 조금 더 자세히 설명해주실 수 있나요?',
            date: '2025.07.30',
            tags: ['답변하기'],
            course: '한식 기초 마스터',
        },
        {
            key: '3',
            name: '영상 속 조리도구 브랜드가 궁금합니다.',
            date: '2025.07.30',
            tags: ['답변하기'],
            course: '한식 기초 마스터',
        },
        {
            key: '4',
            name: '초보자가 하기 어려운 단계가 있다면 알려주세요.',
            date: '2025.07.31',
            tags: ['답변하기'],
            course: '한식 기초 마스터',
        },
        {
            key: '5',
            name: '간을 조절하는 팁이 있으면 공유해주세요.',
            date: '2025.07.31',
            tags: ['답변하기'],
            course: '한식 기초 마스터',
        },
        {
            key: '6',
            name: '이 강좌 이후 추천하는 다음 강좌가 있을까요?',
            date: '2025.08.01',
            tags: ['답변하기'],
            course: '한식 기초 마스터',
        },
        {
            key: '7',
            name: '강의에서 사용하는 고추장은 어떤 종류인가요?',
            date: '2025.08.01',
            tags: ['답변하기'],
            course: '한식 기초 마스터',
        },
        {
            key: '8',
            name: '채소 손질 팁도 다뤄주실 수 있나요?',
            date: '2025.08.02',
            tags: ['답변하기'],
            course: '한식 기초 마스터',
        },
    ];

    return (
        <>
            <Table columns={columns} dataSource={data} />

            <Modal
                title="답변 작성"
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                okText="등록"
                cancelText="취소"
            >
                {/* 질문 정보 출력 */}
                {currentQuestion && (
                    <div style={{ marginBottom: '16px' }}>
                        <p><strong>강좌명:</strong> {currentQuestion.course}</p>
                        <p><strong>작성일:</strong> {currentQuestion.date}</p>
                        <p><strong>질문:</strong> {currentQuestion.name}</p>
                    </div>
                )}

                {/* 답변 입력 */}
                <TextArea
                    rows={4}
                    placeholder="답변을 입력해주세요"
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                />
            </Modal>

        </>
    )
};

export default QandAList;
