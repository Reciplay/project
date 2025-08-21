"use client";

import BaseButton from "@/components/button/baseButton";
import LectureRegisterDatePicker from "@/components/calendar/customLectureDatePicker";
import restClient from "@/lib/axios/restClient";
import { ApiResponse } from "@/types/apiResponse";
import type { LectureChapter, LectureDTO, LectureTodo } from "@/types/lecture";
import { Flex, Input, Upload, message } from "antd";
import type { RcFile } from "antd/es/upload";
import type {
  UploadChangeParam,
  UploadFile,
  UploadProps,
} from "antd/es/upload/interface";
import { useCallback, useMemo, useState } from "react";
import ChapterForm from "./chapterForm";
import styles from "./lectureForm.module.scss";

const { TextArea } = Input;

type Props = {
  /** 부모로 LectureDTO를 올려보내 리스트에 추가 */
  onAdd: (lecture: LectureDTO) => void;

  /** sequence를 부모에서 줄 값 (없으면 0 → 부모가 add 후 재시퀀싱) */
  nextSequence: number;

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
  const [title, setTitle] = useState<string>("");
  const [summary, setSummary] = useState<string>("");
  const [materials, setMaterials] = useState<string>("");
  const [startedAt, setStartedAt] = useState<string>("");
  const [endedAt, setEndedAt] = useState<string>("");
  const [todoText, setTodoText] = useState<string>(""); // 줄바꿈 기준
  const [fileList, setFileList] = useState<UploadFile<RcFile>[]>([]);
  const [localFile, setLocalFile] = useState<File | null>(null); // 업로드 자료(선택)

  /** 파일 제한 */
  const beforeUpload: UploadProps<RcFile>["beforeUpload"] = (file) => {
    // 프로젝트 정책에 맞게 수정 가능
    const okType =
      /^image\//.test(file.type) ||
      /^application\/pdf$/.test(file.type) ||
      /^video\//.test(file.type) ||
      !!file.type;
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
  const onChangeUpload = (
    info: UploadChangeParam<UploadFile<RcFile>>,
  ): void => {
    const last = info.fileList.slice(-1);
    setFileList(last);
    const f = last[0]?.originFileObj; // RcFile extends File
    setLocalFile(f ?? null);
  };

  /** Todo 문자열 → DTO.todos (줄바꿈 기준) */
  const parsedTodos = useMemo(
    () =>
      todoText
        .split(/\r?\n/)
        .map((l) => l.trim())
        .filter((l) => l.length > 0)
        .map((l, i) => ({
          id: undefined,
          sequence: i,
          title: l.slice(0, maxTodoLen),
          type: "NORMAL" as const,
          seconds: 0,
        })),
    [todoText, maxTodoLen],
  );

  /** 생성 가능 여부 */
  const canCreate =
    title.trim().length > 0 && startedAt.length > 0 && endedAt.length > 0;

  /** draft → LectureDTO (폼 내부 변환) */
  const toLecture = useCallback((): LectureDTO => {
    // const materials = localFile ? localFile.name : "";
    return {
      title: title.trim(),
      summary: summary.trim().slice(0, maxSummaryLen),
      sequence: nextSequence,
      materials: materials,
      startedAt,
      endedAt,
      chapterList: [
        {
          sequence: 0,
          title: "기본 챕터",
          // DTO 스키마에 맞춰 todos로 매핑
          todoList: parsedTodos,
        },
      ],
      // 필요 시 DTO 확장 필드가 있다면 타입 정의에 맞춰 추가
      localMaterialFile: localFile ?? null, // 프로젝트의 LectureDTO에 이 필드가 정의돼 있어야 합니다.
    } as LectureDTO;
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
  const reset = (): void => {
    setTitle("");
    setSummary("");
    setStartedAt("");
    setEndedAt("");
    setTodoText("");
    setFileList([]);
    setLocalFile(null);
  };

  /** 생성하기 */
  const handleCreate = (): void => {
    if (!canCreate) {
      message.warning("강의명과 날짜를 입력해주세요.");
      return;
    }
    onAdd(toLecture());
    reset();
  };

  const handleCreateTODO = async (): Promise<void> => {
    try {
      // ✅ FormData 객체 생성
      const formData = new FormData();
      formData.append("title", todoText);

      const lectureData = {
        sequence: nextSequence,
        title: title || "소갈비찜만들기",
        materials: materials || "소갈비 1kg, 무 한 토막, ...",
        summary: summary || "이원준의 소갈비찜 레시피 실시간 강의",
        chapters: ["재료 준비하기", "재료 손질하기", "조리하기", "플레이팅"],
        chapterList: [],
      };

      formData.append("lecture", JSON.stringify(lectureData));

      if (localFile) {
        formData.append(`material/${nextSequence}`, localFile);
      }

      formData.append("lecture", JSON.stringify(lectureData));

      const res = await restClient.post<ApiResponse<LectureChapter>>(
        "/course/lecture/todos",
        formData,
        {
          requireAuth: true,
        },
      );

      console.log("TODO created:", res.data);

      const combinedText = res.data.data.todoList
        .map((e: LectureTodo, idx: number) => `${idx + 1}. ${e.title}`)
        .join("\n");

      setTodoText(combinedText);
    } catch (err) {
      console.error("Error creating TODO:", err);
    }
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
        placeholder="강의를 소개해 주세요 (예: 강의별 내용, 커리큘럼)"
        maxLength={maxSummaryLen}
        value={summary}
        onChange={(e) => setSummary(e.target.value)}
        showCount
      />

      <TextArea
        rows={4}
        placeholder="준비물을 입력해주세요"
        // maxLength={maxSummaryLen}
        value={materials}
        onChange={(e) => setMaterials(e.target.value)}
        showCount
      />

      <ChapterForm
        title={title}
        summary={summary}
        materials={materials}
        localFile={localFile}
        nextSequence={nextSequence}
        onTodosGenerated={(text /* grouped */, raw) => {
          // 수정된 부분
          setTodoText(text); // TextArea에 챕터별로 표시됨
          console.log("RAW:", raw);
        }}
      />

      <TextArea
        rows={4}
        placeholder={`TodoList를 생성해주세요 (한 줄 = 1개, 최대 ${maxTodoLen}자)`}
        maxLength={10000}
        value={todoText}
        onChange={(e) => setTodoText(e.target.value)}
      />

      <BaseButton
        title="강의 생성"
        variant="custom"
        type="button"
        onClick={handleCreate}
        // 필요 시 비활성화
        // disabled={!canCreate}
      />
    </div>
  );
}
