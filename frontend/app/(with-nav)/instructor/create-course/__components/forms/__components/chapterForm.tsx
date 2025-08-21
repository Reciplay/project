"use client"; // 수정된 부분

import restClient from "@/lib/axios/restClient"; // 수정된 부분
import type { ApiResponse } from "@/types/apiResponse"; // 수정된 부분
import { PlusOutlined } from "@ant-design/icons";
import type { GetProp, UploadFile, UploadProps } from "antd";
import { Button, Input, Space, Tag, Upload, message } from "antd";
import { useMemo, useState } from "react"; // 수정된 부분

type RcFile = Parameters<GetProp<UploadProps, "beforeUpload">>[0]; // 수정된 부분

// --- 응답 파싱용 로컬 타입 --- // 수정된 부분
type TodoType = "NORMAL" | "TIMER";
type AIReturnTodo = {
  title: string;
  type: TodoType;
  seconds: number | null;
  sequence: number;
};
type AIReturnChapter = {
  chapterName: string;
  sequence: number;
  numOfTodos: number;
  todos: AIReturnTodo[];
};
type AIReturnLecture = {
  sequence: number;
  title: string;
  summary: string;
  chapters: AIReturnChapter[];
};

// --- 요청 페이로드 타입 --- // 수정된 부분
type LectureForAIRequest = {
  sequence: number;
  title: string;
  materials: string;
  summary: string;
  chapters: string[];
};

interface ChapterFormProps {
  title: string; // 수정된 부분
  summary: string; // 수정된 부분
  materials: string; // 수정된 부분
  localFile?: File | null; // 수정된 부분
  nextSequence?: number; // 수정된 부분
  onTodosGenerated?: (flattenText: string, raw: AIReturnLecture) => void; // 수정된 부분
}

export default function ChapterForm({
  title,
  summary,
  materials,
  localFile,
  nextSequence = 1, // API의 sequence 필드에 사용
  onTodosGenerated,
}: ChapterFormProps) {
  const [chapInput, setChapInput] = useState(""); // 수정된 부분
  const [chapters, setChapters] = useState<string[]>([]); // 수정된 부분
  const [fileList, setFileList] = useState<UploadFile<RcFile>[]>([]); // (선택) 챕터 폼에서도 파일 바꾸고 싶을 때

  // (선택) 이 컴포넌트 내에서도 파일 선택 허용하려면 사용, 아니면 삭제해도 됨
  const beforeUpload: UploadProps<RcFile>["beforeUpload"] = (file) => {
    // 수정된 부분
    const isOk =
      /^application\/pdf$/.test(file.type) ||
      /^image\//.test(file.type) ||
      /^video\//.test(file.type) ||
      !!file.type;
    if (!isOk) {
      message.error("허용되지 않는 파일 형식입니다.");
      return false;
    }
    const uf: UploadFile<RcFile> = {
      uid: file.uid,
      name: file.name,
      status: "done",
      originFileObj: file,
    };
    setFileList([uf]);
    return false; // 자동 업로드 방지
  };

  const effectiveFile = useMemo<File | null>(() => {
    // 수정된 부분
    // 상위에서 내려준 localFile 우선, 없으면 이 컴포넌트에서 선택한 파일
    return localFile ?? fileList[0]?.originFileObj ?? null;
  }, [localFile, fileList]);

  const addChapter = () => {
    // 수정된 부분
    const v = chapInput.trim();
    if (!v) return;
    setChapters((prev) => [...prev, v]);
    setChapInput("");
  };

  const removeChapter = (idx: number) => {
    // 수정된 부분
    setChapters((prev) => prev.filter((_, i) => i !== idx));
  };

  const buildFormData = (): FormData => {
    // 수정된 부분
    const payload: LectureForAIRequest[] = [
      {
        sequence: nextSequence,
        title: title.trim(),
        materials: materials, // 개행 포함 문자열 OK
        summary: summary.trim(),
        chapters, // 사용자가 입력한 챕터명 배열
      },
    ];

    const fd = new FormData();
    fd.append(
      "lecture",
      new Blob([JSON.stringify(payload)], { type: "application/json" }),
    ); // key: lecture
    if (effectiveFile) {
      fd.append("material/0", effectiveFile); // key: material/0
    }

    // 디버그
    console.group("📦[ChapterForm] Request FormData"); // 수정된 부분
    for (const [k, v] of fd.entries()) {
      if (v instanceof File) console.log(k, "(file)", v.name, v.type, v.size);
      else {
        try {
          console.log(k, "(json)", JSON.parse(v as string));
        } catch {
          console.log(k, "(text)", v);
        }
      }
    }
    console.groupEnd();

    return fd;
  };

  const handleGenerate = async () => {
    // 수정된 부분
    try {
      if (!title.trim()) return message.error("강의명을 입력해주세요.");
      if (!summary.trim()) return message.error("요약을 입력해주세요.");
      if (chapters.length === 0)
        return message.error("최소 1개 이상의 챕터명을 추가해주세요.");

      const formData = buildFormData();

      // 응답 제네릭: data가 배열이므로 AIReturnLecture[] 사용
      const res = await restClient.post<ApiResponse<AIReturnLecture[]>>( // 수정된 부분
        "/course/lecture/todos",
        formData,
        { requireAuth: true },
      );

      console.group("📬[ChapterForm] Response"); // 수정된 부분
      console.log(res.data);
      console.groupEnd();

      const payload = res.data?.data;
      const first = Array.isArray(payload) ? payload[0] : undefined;
      if (!first) throw new Error("응답 형식이 올바르지 않습니다.");

      // 플랫 텍스트로 변환 (ex. “1. ...\n2. ...”)
      const flat = first.chapters
        .flatMap((ch) => ch.todos)
        .map((t, i) => `${i + 1}. ${t.title}`)
        .join("\n");

      onTodosGenerated?.(flat, first); // 상위로 결과 전달
      message.success("AI로 TODO가 생성되었습니다.");
    } catch (e: any) {
      console.error(e);
      message.error(e?.message ?? "AI 생성 실패");
    }
  };

  return (
    <div style={{ display: "grid", gap: 10 }}>
      {/* (선택) 이 컴포넌트에서도 파일 바꾸고 싶다면 노출 */}{" "}
      {/* 수정된 부분 */}
      <Upload<RcFile>
        beforeUpload={beforeUpload}
        maxCount={1}
        fileList={fileList}
      >
        <Button icon={<PlusOutlined />}>자료 파일 선택(옵션)</Button>
      </Upload>
      <label>챕터명을 입력해주세요</label>
      <Space.Compact style={{ width: "100%" }}>
        <Input
          placeholder="재료 준비하기"
          value={chapInput}
          onChange={(e) => setChapInput(e.target.value)}
          onPressEnter={addChapter}
        />
        <Button type="primary" onClick={addChapter}>
          추가
        </Button>
      </Space.Compact>
      <div>
        {chapters.map((c, idx) => (
          <Tag
            key={`${c}-${idx}`}
            closable
            onClose={(e) => {
              e.preventDefault();
              removeChapter(idx);
            }}
            style={{ marginBottom: 8 }}
          >
            {idx + 1}. {c}
          </Tag>
        ))}
      </div>
      <Button type="primary" onClick={handleGenerate}>
        AI로 TODO 생성하기
      </Button>
    </div>
  );
}
