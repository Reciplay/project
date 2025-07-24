'use client';

import { useChatBotStore } from '../../stores/chatBotStore';
import ChatConversation from './ChatConversation';
import ChatStyleSelector from './ChatStyleSelector';
import styles from './ChatBot.module.scss';

export default function ChatBot() {
  const { selectedStyle } = useChatBotStore();

  return (
    <div className={styles.chatbotWrapper}>
      {selectedStyle ? <ChatConversation /> : <ChatStyleSelector />}
    </div>
  );
}
