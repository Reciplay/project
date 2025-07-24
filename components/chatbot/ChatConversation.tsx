'use client';

import { useChatBotStore } from '../../stores/chatBotStore';
import { useEffect, useRef, useState } from 'react';
import styles from './ChatConversation.module.scss';

export default function ChatConversation() {
  const {
    selectedStyle,
    messages,
    input,
    styles: chatStyles,
    selectStyle,
    setInput,
    sendMessage,
  } = useChatBotStore();

  const logRef = useRef<HTMLDivElement>(null);
  const [isComposing, setIsComposing] = useState(false);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isComposing) {
      e.preventDefault();
      sendMessage();
    }
  };

  // 자동 스크롤
  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [messages]);

  const botNameMap: Record<string, string> = {
    default: '기본 챗봇',
    loopy: '잔망루피',
    granny: '욕쟁이 할머니',
    cat: '나대는 고양이',
    assistant: '상냥한 비서',
    idol: '하이텐션 아이돌',
    edgelord: '중2병 천재',
    cold: '시크한 상담사',
  };

  const botName = selectedStyle ? botNameMap[selectedStyle] : '챗봇';

  return (
    <div className={styles.chatBody}>
      <div className={styles.chatHeader}>
        <button className={styles.backBtn} onClick={() => selectStyle(null)}>
          ←
        </button>
        <span className={styles.botName}>{botName}</span>
      </div>

      <div className={styles.chatLog} ref={logRef}>
        {messages.map((msg, idx) => (
          <div key={idx} className={`${styles.msg} ${styles[msg.role]}`}>
            <div className={styles.bubble}>{msg.content}</div>
          </div>
        ))}
      </div>

      <div className={styles.inputArea}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onCompositionStart={() => setIsComposing(true)}
          onCompositionEnd={() => setIsComposing(false)}
          placeholder="메시지를 입력하세요..."
        />
      </div>
    </div>
  );
}
