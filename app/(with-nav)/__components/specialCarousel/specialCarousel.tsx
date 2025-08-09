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
        {sampleBanner.map((e: Banner) => (
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
              fill
              className={styles.itemImage}
              // style={{
              //   transform: e.isItemRight
              //     ? "translate(-50%, -50%) translateX(clamp(0px, 10vw, 100px))"
              //     : "translate(-50%, -50%)",
              // }}
              sizes="100vw"
              priority
            />
            {/* 텍스트 오버레이 (항상 최상단!) */}
            <div
              className={`${styles.textOverlay} ${
                e.isItemRight ? styles.leftAlign : styles.rightAlign
              }`}
            >
              <div className={styles.title}>{e.title}</div>
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
