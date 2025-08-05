"use client";

import React from "react";
import { Carousel as AntdCarousel } from "antd";
import styles from "./specialCarousel.module.scss";
import Image from "next/image";

const contentStyle: React.CSSProperties = {
  margin: 0,
  height: "300px",
  color: "#fff",
  lineHeight: "160px",
  textAlign: "center",
  background: "#364d79",
};

export default function SpecialCarousel() {
  const onChange = (currentSlide: number) => {
    console.log(currentSlide);
  };

  return (
    <div className={styles.carouselWrapper}>
      <AntdCarousel afterChange={onChange}>
        <div className={styles.imageSlide}>
          <Image
            src="/images/mainbanner1.png"
            alt="메인 배너 이미지"
            fill
            className={styles.bannerImage}
            style={{ objectFit: "cover" }}
          />
        </div>
        <div className={styles.imageSlide}>
          <Image
            src="/images/mainbanner2.png"
            alt="메인 배너 이미지2"
            fill
            className={styles.bannerImage}
            style={{ objectFit: "cover" }}
          />
        </div>
      </AntdCarousel>
    </div>
  );
}
