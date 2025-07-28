"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./carousel.module.scss";
import Image from "next/image";
import BannerImage from "../image/bannerImage";
import ImageWrapper from "../image/imageWrapper";
import { IMAGETYPE } from "@/types/image";

const images = [
  "/images/featured_banner_0.jpg",
  "/images/featured_banner_1.jpg",
  "/images/featured_banner_2.jpg",
  "/images/featured_banner_3.jpg",
];

export default function Carousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const changeImage = (index: number) => {
    setCurrentIndex(index);
    resetTimer();
  };

  const resetTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 4000); // 4초 간격
  };

  useEffect(() => {
    resetTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  return (
    <div className={styles.carousel}>
      <div className={styles.main}>
        <ImageWrapper
          src={images[currentIndex]}
          alt={`featured_banner`}
          onClick={() => {}}
          type={IMAGETYPE.FEAUTRED_MAIN}
        />
      </div>
      <div className={styles.thumbnails}>
        {images.map((img, i) => (
          <ImageWrapper
            key={i}
            src={img}
            alt={`Thumb ${i}`}
            onClick={() => changeImage(i)}
            type={IMAGETYPE.FEATURED_THUMNAIL}
            className={`${styles.thumbnail} ${
              i === currentIndex ? styles.active : ""
            }`}
          />
        ))}
      </div>
    </div>
  );
}
