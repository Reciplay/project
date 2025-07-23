'use client';

import { useChatStore } from '@/stores/chatStore';
import styles from './ChatStyleSelector.module.scss';

export default function ChatStyleSelector() {
  const { styles: chatStyles, selectStyle } = useChatStore();

  return (
    <div className={styles.selector}>
      <p className={styles.title}>💬 누구와 대화하시겠습니까?</p>
      <ul>
        {Object.entries(chatStyles).map(([key, style]) => (
          <li
            key={key}
            onClick={() => selectStyle(key)}
            className={styles.styleOption}
          >
            {style.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
