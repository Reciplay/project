// 메시지 타입 정의
export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

// 스토어 상태 및 액션 타입 정의
export interface ChatBotState {
  isChatOpen: boolean;
  selectedStyle: string | null;
  input: string;
  messages: Message[];
  isLoading: boolean;
  styles: Record<string, { name: string }>;
  toggleChat: () => void;
  selectStyle: (styleKey: string | null) => void;
  setInput: (input: string) => void;
  sendMessage: () => Promise<void>;
}
