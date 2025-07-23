import { create } from 'zustand';

// 메시지 타입 정의
interface Message {
  role: 'user' | 'assistant';
  content: string;
}

// 스토어 상태 및 액션 타입 정의
interface ChatState {
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

// 실제 API 호출을 위한 채팅 메시지 전송 함수
const sendChatMessage = async (style: string, message: string): Promise<{ answer: string }> => {
  try {
    const response = await fetch('/api/chat/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'user-id': 'jake', // ← 하이픈!
      },
      body: JSON.stringify({
        message: message,
      }),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const text = await response.text();
    return { answer: text || '응답 형식이 올바르지 않습니다.' };
  } catch (error) {
    console.error('Failed to send message:', error);
    return { answer: '메시지 전송에 실패했습니다. 잠시 후 다시 시도해주세요.' };
  }
};

export const useChatStore = create<ChatState>((set, get) => ({
  isChatOpen: false,
  selectedStyle: null,
  input: '',
  messages: [],
  isLoading: false,
  styles: {
    default: { name: '기본 챗봇' },
    loopy: { name: '잔망루피' },
    granny: { name: '욕쟁이 할머니' },
    cat: { name: '나대는 고양이' },
    assistant: { name: '상냥한 비서' },
    idol: { name: '하이텐션 아이돌' },
    edgelord: { name: '중2병 천재' },
    cold: { name: '시크한 상담사' },
  },

  toggleChat: () => set((state) => ({ isChatOpen: !state.isChatOpen })),

  selectStyle: (styleKey) => {
    set({ selectedStyle: styleKey, messages: [], input: '' });
  },

  setInput: (input) => set({ input }),

  sendMessage: async () => {
    const { input, selectedStyle } = get();
    if (!input.trim()) return;

    const userMsg: Message = { role: 'user', content: input };
    set((state) => ({
      messages: [...state.messages, userMsg],
      input: '',
      isLoading: true,
    }));

    // 임시 로딩 메시지 추가
    const loadingMsg: Message = { role: 'assistant', content: '...' };
    set((state) => ({ messages: [...state.messages, loadingMsg] }));

    const style = selectedStyle || 'default';
    const response = await sendChatMessage(style, input);

    const assistantMsg: Message = { role: 'assistant', content: response.answer };
    set((state) => ({
      // 마지막 로딩 메시지를 실제 응답으로 교체
      messages: [...state.messages.slice(0, -1), assistantMsg],
      isLoading: false,
    }));
  },
}));
