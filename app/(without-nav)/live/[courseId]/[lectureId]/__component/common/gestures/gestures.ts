// /components/live/gestures.ts
export const GESTURES = {
  studentQuestion: "studentQuestion",
  screenshot: "screenshot",
  switchStudentScreen: "switchStudentScreen",
  toggleTodo: "toggleTodo",
  nextChapter: "nextChapter",
  none: "none",
} as const;

export type GestureName = (typeof GESTURES)[keyof typeof GESTURES];
