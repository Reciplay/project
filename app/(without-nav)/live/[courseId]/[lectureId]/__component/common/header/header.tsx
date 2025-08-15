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
}

export default function Header({
  lectureName,
  // courseName, !태욱 사용하지 않는 변수라서 주석처리함
  onExit,
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

  const toggleMic = () => setIsMicOn(!isMicOn);
  const toggleCamera = () => setIsCameraOn(!isCameraOn);

  return (
    <header className={styles.header}>
      <div className={styles.info}>
        <span>{time}</span>
        <span className={styles.separator}>|</span>
        <span>{lectureName}</span>
      </div>
      <div className={styles.controls}>
        <button
          onClick={toggleMic}
          className={`${styles.controlButton} ${!isMicOn ? styles.off : ""}`}
        >
          {isMicOn ? (
            <IconMicrophone size={24} />
          ) : (
            <IconMicrophoneOff size={24} />
          )}
        </button>
        <button
          onClick={toggleCamera}
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
