"use client";

import React from "react";
import { Carousel as AntdCarousel } from "antd";
import styles from "./customCarousel.module.scss";
import Image from "next/image";

const contentStyle: React.CSSProperties = {
  margin: 0,
  height: "300px",
  color: "#fff",
  lineHeight: "160px",
  textAlign: "center",
  background: "#364d79",
};

export default function CustomCarousel() {
  const onChange = (currentSlide: number) => {
    console.log(currentSlide);
  };

  return (
    <div className={styles.carouselWrapper}>
      <AntdCarousel
        autoplay={{ dotDuration: true }}
        autoplaySpeed={5000}
        afterChange={onChange}
      >
        <Image
          src="/images/food1.jpg"
          alt="메인 배너 이미지"
          width={500}
          height={350}
          className={styles.bannerImage}
          style={{ objectFit: "cover" }}
        />
        <Image
          src="/images/food2.jpg"
          alt="메인 배너 이미지2"
          width={500}
          height={350}
          className={styles.bannerImage}
          style={{ objectFit: "cover" }}
        />
        <Image
          src="/images/food3.jpg"
          alt="메인 배너 이미지3"
          width={500}
          height={350}
          className={styles.bannerImage}
          style={{ objectFit: "cover" }}
        />
      </AntdCarousel>
    </div>
  );
}
