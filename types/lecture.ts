export type LectureTodo = {
  id?: number;
  sequence: number;
  title: string;
  type: "NORMAL" | string;
  seconds: number;
};

export type LectureChapter = {
  id?: number;
  sequence: number;
  title: string;
  /** 도메인 표준: todos */
  todos: LectureTodo[];
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
