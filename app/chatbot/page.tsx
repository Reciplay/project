import ChatBot from '@/components/chatbot/ChatBot';
import styles from './page.module.scss';

export default function ChatbotPage() {
  return (
    <main className={styles.main}>
      <div className={styles.chatContainer}>
        <ChatBot />
      </div>
    </main>
  );
}
