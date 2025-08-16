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
  const [timeLeft, setTimeLeft] = useState(minutes * 60 + seconds);

  // props로 전달된 시간이 변경될 때마다 내부 타이머 상태를 동기화합니다.
  useEffect(() => {
    setTimeLeft(minutes * 60 + seconds);
  }, [minutes, seconds]);

  // 타이머의 카운트다운 로직을 처리합니다.
  useEffect(() => {
    // 타이머가 실행 중이 아니거나, 남은 시간이 없으면 아무것도 하지 않습니다.
    if (!isRunning || timeLeft <= 0) {
      return;
    }

    // 1초마다 timeLeft를 1씩 감소시킵니다.
    const intervalId = setInterval(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);

    // 컴포넌트가 언마운트되거나, 의존성이 변경될 때 인터벌을 정리합니다.
    return () => clearInterval(intervalId);
  }, [isRunning, timeLeft]);

  // 타이머가 종료되었을 때 onFinish 콜백을 호출합니다.
  useEffect(() => {
    // 타이머가 실행 중이었고, 남은 시간이 0이 되면 onFinish를 호출합니다.
    if (isRunning && timeLeft <= 0) {
      if (onFinish) {
        onFinish();
      }
    }
  }, [isRunning, timeLeft, onFinish]);

  const displayMinutes = Math.floor(timeLeft / 60)
    .toString()
    .padStart(2, "0");
  const displaySeconds = (timeLeft % 60).toString().padStart(2, "0");

  return (
    <div>
      <span>{displayMinutes}</span>:<span>{displaySeconds}</span>
    </div>
  );
};

export default SetTimer;
