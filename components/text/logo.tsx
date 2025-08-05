"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./logo.module.scss"; // .logo 스타일 포함
import FuzzyText from "./fuzzyText";

export default function Logo() {
  const [baseIntensity, setBaseIntensity] = useState(0);

  useEffect(() => {
    let frameId: number;
    const start = Date.now();

    function animate() {
      const elapsed = (Date.now() - start) / 1000; // 초 단위

      const t = elapsed % 3; // 3초 주기

      if (t < 2) {
        setBaseIntensity(0); // 2초 동안 0
      } else {
        // t: 2 ~ 3, 1초간 0→1→0
        // 0 ~ 1초를 0→1→0으로 변환 (사인파 사용)
        const progress = (t - 2) / 1; // 0~1
        const intensity = Math.sin(progress * Math.PI); // 0~1~0
        setBaseIntensity(intensity);
      }
      frameId = requestAnimationFrame(animate);
    }

    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, []);

  return (
    <FuzzyText
      // fontSize="clamp(0.9rem, 3.5vw, 3.5rem)"
      className={styles.logo}
      baseIntensity={baseIntensity}
      hoverIntensity={0.6}
      enableHover={true}
      color="ffffff"
    >
      Reciplay
    </FuzzyText>
  );
}
