"use client";

import { Banner, sampleBanner } from "@/config/sampleBanner";
import { Carousel as AntdCarousel } from "antd";
import Image from "next/image";
import styles from "./specialCarousel.module.scss";

export default function SpecialCarousel() {
  const onChange = (currentSlide: number) => {
    console.log(currentSlide);
  };

  return (
    <div className={styles.carouselWrapper}>
      <AntdCarousel afterChange={onChange} effect="fade">
        {sampleBanner.map((e: Banner, idx: number) => (
          <div key={e.id} className={styles.imageSlide}>
            <Image
              src={e.background}
              alt="메인 배너 이미지"
              fill
              className={styles.bannerImage}
              sizes="100vw"
              priority
            />
            <Image
              src={e.item}
              alt="위에 올라가는 이미지"
              width={800}
              height={800}
              className={styles.itemImage}
              sizes="(max-width: 768px) 40vw, 24.35vw"
              priority
              style={{
                position: "absolute",
                top: "55%",
                left: "55%", // 기본 위치
                transform: "translate(-50%, -50%)",
                width: "26%", // 크기 그대로 유지
                height: "auto",
                objectFit: "contain",
                pointerEvents: "none",
                zIndex: 2,
                transition: "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
                ...(idx === 0 ? { left: "28%", width: "29%" } : {}), // ← 두 번째만 왼쪽으로 이동
              }}
            />

            {/* 텍스트 오버레이 (항상 최상단!) */}
            <div
              className={`${styles.textOverlay} ${
                e.isItemRight ? styles.leftAlign : styles.rightAlign
              } ${
                idx === 0
                  ? `${styles.glassOverlay} ${styles.variantSmallText} ${styles.glassSoft}`
                  : ""
              }`}
            >
              <div className={styles.title}>
                {idx === 0 ? e.title.replace(", ", ",\n") : e.title}
              </div>
              <div className={styles.desc}>{e.desc}</div>
              <div className={styles.slogan}>{e.slogan}</div>
              <a className={styles.ctaButton} href="#">
                바로가기
              </a>
            </div>
          </div>
        ))}
      </AntdCarousel>
    </div>
  );
}
