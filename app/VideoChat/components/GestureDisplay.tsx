'use client';

import { useEffect, useRef } from 'react';
import styles from './GestureDisplay.module.css';

type GestureDisplayProps = {
  gesture: string;
  onClap?: () => void;
};

const GestureDisplay = ({ gesture, onClap }: GestureDisplayProps) => {
  // 과도한 중복 발사 방지(디바운스/스로틀)
  const lastFiredAt = useRef(0);

  useEffect(() => {
    if (gesture !== 'clap') return;

    const now = Date.now();
    if (now - lastFiredAt.current < 1500) return; // 1.5초 쿨다운
    lastFiredAt.current = now;

    onClap?.(); // ← 부모에게 알려줘서 거기서 publish
  }, [gesture, onClap]);

  return (
    <div className={styles.container}>
      <h4>Detected Gesture</h4>
      <p>{gesture || 'None'}</p>
    </div>
  );
};

export default GestureDisplay;
