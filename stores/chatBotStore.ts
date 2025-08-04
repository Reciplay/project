import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface ChatbotStore {
  messages: string[]
  addMessage: (message: string) => void
  clearMessages: () => void
}

export const useChatbotStore = create<ChatbotStore>()(
  persist(
    (set) => ({
      messages: [],
      addMessage: (message: string) =>
        set((state) => ({ messages: [...state.messages, message] })),
      clearMessages: () => set({ messages: [] }),
    }),
    {
      name: 'chatbot-storage', // unique name for storage
    },
  ),
)
