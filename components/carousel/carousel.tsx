"use client";

import { Carousel as AntdCarousel } from "antd";
import Image from "next/image";
import styles from "./carousel.module.scss";

export default function MainCarousel() {
  const onChange = (currentSlide: number) => {
    console.log(currentSlide);
  };

  return (
    <div className={styles.carouselWrapper}>
      <AntdCarousel afterChange={onChange}>
        <Image
          src="/images/mainbanner1.png"
          alt="메인 배너 이미지"
          width={1250}
          height={350}
          className={styles.bannerImage}
          style={{ objectFit: "cover" }}
        />
        <Image
          src="/images/mainbanner2.png"
          alt="메인 배너 이미지2"
          width={1250}
          height={350}
          className={styles.bannerImage}
          style={{ objectFit: "cover" }}
        />
      </AntdCarousel>
    </div>
  );
}
