export interface QnA {
  qnaId: number;
  title: string;
  questionerNickname: string;
  questionAt: string;
  isAnswered: boolean;
}
export type NewQuestion = {
  id: number;
  title: string;
  content: string;
  questionAt: string; // ISO
  courseName: string;
  courseId: number;
};

export interface QnaDetail {
  title: string;
  questionContent: string;
  answerContent: string | null;
  answerAt: string | null;
  questionUpdateAt: string;
  answerUpdateAt: string | null;
}