"use client";

import GlassSurface from "@/components/glass/glassSurface";
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
              <GlassSurface
                opacity={0.75}
                blur={32}
                borderRadius={22}
                saturation={1.7}
                brightness={1.02}
                className={styles.glassTextOverlay}
                width={400}
                height={150}
                style={{
                  border: "1.5px solid rgba(255,255,255,0.28)",
                  // boxShadow 옵션도 살짝 더 진하게
                  boxShadow: "0 10px 32px 0 rgba(40,37,89,0.20)",
                }}
              >
                <div className={styles.title}>{e.title}</div>
                <div className={styles.desc}>{e.desc}</div>
                <div className={styles.slogan}>{e.slogan}</div>
                <a className={styles.ctaButton} href="#">
                  바로가기
                </a>
              </GlassSurface>
            </div>
          </div>
        ))}
      </AntdCarousel>
    </div>
  );
}
