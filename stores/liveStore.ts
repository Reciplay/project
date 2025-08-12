import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export type TodoType = 'NORMAL' | 'TIMER' | 'ACTION';

export interface ChapterTodoItem {
  title: string;
  type: TodoType;
  seconds: number | null;
  sequence: number;
}

export interface ChapterTodoResponse {
  // 서버 응답 예시 기준
  type?: 'chapter-issue'; // 서버가 type을 넣어줄 수도 있으니 optional
  chapterId: number;
  chapterSequence: number;
  chapterName: string;
  numOfTodos: number;
  todos: ChapterTodoItem[];
}

interface LiveState {
  chapter: ChapterTodoResponse | null;
  setChapter: (payload: ChapterTodoResponse) => void;
  clearChapter: () => void;
}

export const useLiveStore = create<LiveState>()(
  devtools((set) => ({
    chapter: null,
    setChapter: (payload) => set({ chapter: payload }),
    clearChapter: () => set({ chapter: null }),
  }))
);
