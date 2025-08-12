export interface TodoItem {
  title: string;
  type: 'NORMAL' | 'TIMER';
  seconds: number | null;
  sequence: number;
}

export interface CookingChapter {
  chapterId: number;
  chapterNumber: number;
  numOfTodos: number;
  todos: TodoItem[];
}
