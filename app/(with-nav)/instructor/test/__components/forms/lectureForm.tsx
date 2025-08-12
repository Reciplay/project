// import BaseButton from "@/components/button/baseButton";
// import LectureRegisterDatePicker from "@/components/calendar/lectureRegisterDatePicker";
// import { Flex, Input } from "antd";
// import styles from "./lectureForm.module.scss";

// export default function LectureForm() {
//   const { TextArea } = Input;
//   return (
//     <>
//       <div className={styles.container}>
//         <Flex vertical gap={12}>
//           <Input placeholder="강의명을 입력해주세요" variant="underlined" />
//         </Flex>
//         <LectureRegisterDatePicker></LectureRegisterDatePicker>
//         <TextArea
//           rows={4}
//           placeholder="강의를 소개해 주세요 필수내용 - 강의별 내용(커리큘럼) 준비물"
//           maxLength={6}
//         />
//         <BaseButton title="생성하기" variant="custom"></BaseButton>
//         <TextArea
//           rows={4}
//           placeholder="TodoList를 생성해주세요"
//           maxLength={6}
//         />
//         <span>강의 자료 업로드 인풋 버튼 만들기</span>
//       </div>
//     </>
//   );
// }
"use client";

import BaseButton from "@/components/button/baseButton";
import LectureRegisterDatePicker from "@/components/calendar/customLectureDatePicker";
import { LectureDTO } from "@/types/lecture";
import { Flex, Input, Upload, message } from "antd";
import type {
  RcFile,
  UploadChangeParam,
  UploadFile,
  UploadProps,
} from "antd/es/upload/interface";
import { useCallback, useMemo, useState } from "react";
import styles from "./lectureForm.module.scss";

const { TextArea } = Input;

// /** 서버 JSON 스펙 + 로컬 파일 보관 필드 */
// export type LectureDTO = {
//   title: string;
//   summary: string;
//   sequence: number; // 0부터, 부모에서 부여
//   materials: string; // 파일명/URL(문자열) — JSON에만 들어감
//   startedAt: string; // ISO (customLectureDatePicker 기본 반환)
//   endedAt: string; // ISO
//   chapterList: {
//     id?: number;
//     sequence: number;
//     title: string;
//     todoList: {
//       id?: number;
//       sequence: number;
//       title: string;
//       type: "NORMAL" | string;
//       seconds: number;
//     }[];
//   }[];
//   /** ⬇ 제출 시 material/{index}로 보낼 로컬 파일(폼 내부 보관) */
//   localMaterialFile?: File | RcFile | null;
// };

type Props = {
  /** 부모로 draft를 올려보내 리스트에 추가 */
  onAdd: (lecture: LectureDTO) => void;

  /** sequence를 부모에서 줄 값 (없으면 0 → 부모가 add 후 재시퀀싱) */
  nextSequence?: number;

  /** UI 옵션 */
  maxSummaryLen?: number; // 기본 1000
  maxTodoLen?: number; // 기본 500
};

export default function LectureForm({
  onAdd,
  nextSequence = 0,
  maxSummaryLen = 1000,
  maxTodoLen = 500,
}: Props) {
  /** ---- Draft 상태 ---- */
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [startedAt, setStartedAt] = useState<string>("");
  const [endedAt, setEndedAt] = useState<string>("");
  const [todoText, setTodoText] = useState(""); // 줄바꿈 기준
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [localFile, setLocalFile] = useState<RcFile | null>(null);

  /** 파일 제한 */
  const beforeUpload: UploadProps["beforeUpload"] = (file) => {
    // 프로젝트 정책에 맞게 수정 가능
    const okType =
      /^image\/|^application\/pdf$|^video\//.test(file.type) || !!file.type;
    if (!okType) {
      message.error("허용되지 않는 파일 형식입니다.");
      return Upload.LIST_IGNORE;
    }
    const isLt200M = file.size / 1024 / 1024 < 200;
    if (!isLt200M) {
      message.error("파일 크기는 200MB 이하여야 합니다.");
      return Upload.LIST_IGNORE;
    }
    return false; // 실제 업로드는 제출 단계에서
  };

  /** Upload onChange (단일 파일 유지) */
  const onChangeUpload = (info: UploadChangeParam<UploadFile>) => {
    const last = info.fileList.slice(-1);
    setFileList(last);
    const f = last[0]?.originFileObj as RcFile | undefined;
    setLocalFile(f ?? null);
  };

  /** Todo 문자열 → DTO (줄바꿈 기준) */
  const parsedTodos = useMemo(() => {
    const lines = todoText
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean);
    return lines.map((l, i) => ({
      id: undefined,
      sequence: i,
      title: l.slice(0, maxTodoLen),
      type: "NORMAL" as const,
      seconds: 0,
    }));
  }, [todoText, maxTodoLen]);

  /** 생성 가능 여부 */
  const canCreate = title.trim().length > 0 && !!startedAt && !!endedAt;

  /** draft → LectureDTO */
  const toLecture = useCallback((): LectureDTO => {
    const materialsName = localFile ? localFile.name : "";
    return {
      title: title.trim(),
      summary: summary.trim().slice(0, maxSummaryLen),
      sequence: nextSequence,
      materials: materialsName,
      startedAt,
      endedAt,
      chapterList: [
        {
          sequence: 0,
          title: "기본 챕터",
          /** 여기! todos 사용 */
          todos: parsedTodos,
        },
      ],
      localMaterialFile: localFile ?? null,
    };
  }, [
    title,
    summary,
    maxSummaryLen,
    nextSequence,
    startedAt,
    endedAt,
    parsedTodos,
    localFile,
  ]);

  /** 리셋 */
  const reset = () => {
    setTitle("");
    setSummary("");
    setStartedAt("");
    setEndedAt("");
    setTodoText("");
    setFileList([]);
    setLocalFile(null);
  };

  /** 생성하기 */
  const handleCreate = () => {
    if (!canCreate) {
      message.warning("강의명과 날짜를 입력해주세요.");
      return;
    }
    onAdd(toLecture());
    reset();
  };

  return (
    <div className={styles.container}>
      <Flex vertical gap={12}>
        <Input
          placeholder="강의명을 입력해주세요"
          variant="underlined"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </Flex>

      {/* 날짜 선택(ISO 반환) */}
      <LectureRegisterDatePicker
        value={{ startedAt, endedAt }}
        onChange={(v) => {
          setStartedAt(v?.startedAt ?? "");
          setEndedAt(v?.endedAt ?? "");
        }}
      />

      <TextArea
        rows={4}
        placeholder="강의를 소개해 주세요 (예: 강의별 내용, 커리큘럼, 준비물)"
        maxLength={maxSummaryLen}
        value={summary}
        onChange={(e) => setSummary(e.target.value)}
        showCount
      />

      {/* 자료 파일 (단일) */}
      <Upload
        beforeUpload={beforeUpload}
        fileList={fileList}
        onChange={onChangeUpload}
        maxCount={1}
        showUploadList
      >
        <BaseButton title="강의 자료 선택" variant="custom" type="button" />
      </Upload>

      <TextArea
        rows={4}
        placeholder={`TodoList를 생성해주세요 (한 줄 = 1개, 최대 ${maxTodoLen}자)`}
        maxLength={10000}
        value={todoText}
        onChange={(e) => setTodoText(e.target.value)}
      />

      <BaseButton
        title="생성하기"
        variant="custom"
        type="button"
        onClick={handleCreate}
        // 필요 시 비활성화
        // disabled={!canCreate}
      />
    </div>
  );
}
