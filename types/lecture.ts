export type LectureTodo = {
  id?: number;
  sequence: number;
  title: string;
  type: "NORMAL" | "TIMER";
  seconds: number;
};

export type LectureChapter = {
  id?: number;
  sequence: number;
  title: string;
  /** 도메인 표준: todoList */
  todoList: LectureTodo[]; // Changed from todos
};
export type LectureDTO = {
  title: string;
  summary: string;
  sequence: number;
  materials: string;
  startedAt: string;
  endedAt: string;
  chapterList: LectureChapter[];
  localMaterialFile?: File | null;
};

export interface LectureSummary {
  sequence: number;
  lectureId: number;
  title: string;
  startedAt: string;
  isSkipped: boolean;
}

// New types for lecture update API
export interface UpdateLectureRequest {
  lecture: LectureDTO[];
}
