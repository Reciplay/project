import { create } from 'zustand';

interface Todo {
  title: string;
  type: string;
  seconds: number;
  sequence: number;
}

interface TodoState {
  todos: Todo[];
  setTodos: (todos: Todo[]) => void;
}

export const useTodoStore = create<TodoState>((set) => ({
  todos: [],
  setTodos: (todos) => set({ todos }),
}));