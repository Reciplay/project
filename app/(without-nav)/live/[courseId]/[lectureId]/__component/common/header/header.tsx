"use client";

import {
  IconMicrophone,
  IconMicrophoneOff,
  IconPhoneOff,
  IconVideo,
  IconVideoOff,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";
import styles from "./header.module.scss";

interface HeaderProps {
  lectureName: string;
  courseName: string;
  onExit: () => void;
  onToggleMic: () => void;
  onToggleCamera?: () => void; // Optional for now
}

export default function Header({
  lectureName,
  onExit,
  onToggleMic,
  onToggleCamera,
}: HeaderProps) {
  const [time, setTime] = useState("");
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" }),
      );
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleToggleMic = () => {
    setIsMicOn(!isMicOn);
    onToggleMic();
  };

  const handleToggleCamera = () => {
    setIsCameraOn(!isCameraOn);
    if (onToggleCamera) {
      onToggleCamera();
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.info}>
        <span>{time}</span>
        <span className={styles.separator}>|</span>
        <span>{lectureName}</span>
      </div>
      <div className={styles.controls}>
        <button
          onClick={handleToggleMic}
          className={`${styles.controlButton} ${!isMicOn ? styles.off : ""}`}
        >
          {isMicOn ? (
            <IconMicrophone size={24} />
          ) : (
            <IconMicrophoneOff size={24} />
          )}
        </button>
        <button
          onClick={handleToggleCamera}
          className={`${styles.controlButton} ${!isCameraOn ? styles.off : ""}`}
        >
          {isCameraOn ? <IconVideo size={24} /> : <IconVideoOff size={24} />}
        </button>
        <button
          onClick={onExit}
          className={`${styles.controlButton} ${styles.exit}`}
        >
          <IconPhoneOff size={24} />
        </button>
      </div>
    </header>
  );
}
