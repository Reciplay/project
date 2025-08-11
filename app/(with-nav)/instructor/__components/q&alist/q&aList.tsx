"use client";

import type { NewQuestion } from "@/types/qna";
import type { TableProps } from "antd";
import { Input, Modal, Table, Tag, message } from "antd";
import { useMemo, useState } from "react";

const { TextArea } = Input;

interface QandAListProps {
  questions: NewQuestion[];
  /** 답변 제출 콜백: 실제 API 호출을 부모에서 수행 */
  onSubmitAnswer?: (params: {
    questionId: number;
    courseId: number;
    answer: string;
  }) => Promise<void> | void;
}

export default function QandAList({
  questions,
  onSubmitAnswer,
}: QandAListProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [current, setCurrent] = useState<NewQuestion | null>(null);
  const [answer, setAnswer] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // ISO → "YYYY.MM.DD" 간단 포맷터
  const fmt = (iso: string) => {
    const d = new Date(iso);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}.${m}.${day}`;
  };

  // 테이블 컬럼
  const columns: TableProps<NewQuestion>["columns"] = useMemo(
    () => [
      {
        title: "질문",
        dataIndex: "title",
        render: (text: string) => <a>{text}</a>,
      },
      {
        title: "작성일",
        dataIndex: "questionAt",
        width: 140,
        render: (iso: string) => fmt(iso),
      },
      {
        title: "강좌명",
        dataIndex: "courseName",
        width: 200,
      },
      {
        title: "답변",
        key: "action",
        width: 120,
        render: (_: unknown, record: NewQuestion) => (
          <Tag
            color="blue"
            onClick={() => {
              setCurrent(record);
              setIsModalOpen(true);
            }}
            style={{ cursor: "pointer" }}
          >
            답변하기
          </Tag>
        ),
      },
    ],
    []
  );

  const handleOk = async () => {
    if (!current) return;
    if (!answer.trim()) {
      message.warning("답변을 입력해주세요.");
      return;
    }
    try {
      setSubmitting(true);
      await onSubmitAnswer?.({
        questionId: current.id,
        courseId: current.courseId,
        answer: answer.trim(),
      });
      message.success("답변이 등록되었습니다.");
      setIsModalOpen(false);
      setAnswer("");
      setCurrent(null);
    } catch (e) {
      message.error("답변 등록에 실패했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setAnswer("");
    setCurrent(null);
  };

  return (
    <>
      <Table
        columns={columns}
        dataSource={questions}
        rowKey="id"
        pagination={{ pageSize: 8 }}
      />

      <Modal
        title="답변 작성"
        open={isModalOpen}
        onOk={handleOk}
        confirmLoading={submitting}
        onCancel={handleCancel}
        okText="등록"
        cancelText="취소"
      >
        {current && (
          <div style={{ marginBottom: 16, lineHeight: 1.7 }}>
            <p>
              <strong>강좌명:</strong> {current.courseName}
            </p>
            <p>
              <strong>작성일:</strong> {fmt(current.questionAt)}
            </p>
            <p>
              <strong>질문:</strong> {current.title}
            </p>
            {current.content && (
              <p style={{ whiteSpace: "pre-wrap", color: "#666" }}>
                {current.content}
              </p>
            )}
          </div>
        )}

        <TextArea
          rows={5}
          placeholder="답변을 입력해주세요"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
        />
      </Modal>
    </>
  );
}
