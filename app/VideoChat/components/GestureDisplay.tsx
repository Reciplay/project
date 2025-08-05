import React, { useState, useEffect, useRef } from 'react';
import styles from './GestureDisplay.module.css';

interface GestureDisplayProps {
  gestures: {
    left: string;
    right: string;
  };
}

const GestureDisplay = ({ gestures }: GestureDisplayProps) => {
  const [gestureLog, setGestureLog] = useState<string[]>([]);
  const prevGesturesRef = useRef(gestures);

  useEffect(() => {
    const prevLeft = prevGesturesRef.current.left;
    const prevRight = prevGesturesRef.current.right;
    const { left, right } = gestures;

    if (left !== 'None' && left !== prevLeft) {
      setGestureLog(prevLog => [...prevLog, `Left: ${left}`]);
    }
    if (right !== 'None' && right !== prevRight) {
      setGestureLog(prevLog => [...prevLog, `Right: ${right}`]);
    }

    prevGesturesRef.current = gestures;
  }, [gestures]);

  return (
    <div className={styles.gestureContainer}>
      <h3>Recognized Gestures</h3>
      <p className={styles.gestureText}>Left: {gestures.left}</p>
      <p className={styles.gestureText}>Right: {gestures.right}</p>
      <div className={styles.gestureLog}>
        <h4>Gesture Log</h4>
        {gestureLog.map((log, index) => (
          <p key={index} className={styles.logEntry}>{log}</p>
        ))}
      </div>
    </div>
  );
};

export default GestureDisplay;
