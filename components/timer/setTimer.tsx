import React, { useEffect, useState } from "react";

interface SetTimerProps {
  minutes: number;
  seconds: number;
  isRunning: boolean;
  onFinish?: () => void;
}

const SetTimer: React.FC<SetTimerProps> = ({
  minutes,
  seconds,
  isRunning,
  onFinish,
}) => {
  const [totalSeconds, setTotalSeconds] = useState(minutes * 60 + seconds);

  useEffect(() => {
    setTotalSeconds(minutes * 60 + seconds);
  }, [minutes, seconds]);

  useEffect(() => {
    if (!isRunning) {
      return;
    }

    if (totalSeconds <= 0) {
      if (onFinish) {
        onFinish();
      }
      return;
    }

    const intervalId = setInterval(() => {
      setTotalSeconds((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [isRunning, totalSeconds, onFinish]);

  const displayMinutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const displaySeconds = (totalSeconds % 60).toString().padStart(2, "0");

  return (
    <div>
      <span>{displayMinutes}</span>:<span>{displaySeconds}</span>
    </div>
  );
};

export default SetTimer;
