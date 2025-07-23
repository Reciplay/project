'use client';

import { useChatStore } from '@/stores/chatStore';
import ChatConversation from './ChatConversation';
import ChatStyleSelector from './ChatStyleSelector';
import styles from './ChatBot.module.scss';

export default function ChatBot() {
  const { selectedStyle } = useChatStore();

  return (
    <div className={styles.chatbotWrapper}>
      {selectedStyle ? <ChatConversation /> : <ChatStyleSelector />}
    </div>
  );
}
