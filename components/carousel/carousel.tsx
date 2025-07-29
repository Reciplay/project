"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./carousel.module.scss";
import ImageWrapper from "../image/imageWrapper";
import { IMAGETYPE } from "@/types/image";

interface CarouselItem {
  image: string;
  onClick?: VoidFunction;
}

interface CarouselProps {
  props: CarouselItem[];
}

export default function Carousel({ props }: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const changeImage = (index: number) => {
    setCurrentIndex(index);
    resetTimer();
  };

  const resetTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % props.length);
    }, 4000); // 4초 간격
  };

  useEffect(() => {
    resetTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [props.length]);

  return (
    <div className={styles.carousel}>
      <div className={styles.main}>
        <ImageWrapper
          src={props[currentIndex].image}
          alt={`featured_banner`}
          onClick={props[currentIndex].onClick}
          type={IMAGETYPE.FEAUTRED_MAIN}
        />
      </div>
      <div className={styles.thumbnails}>
        {props.map((item, i) => (
          <ImageWrapper
            key={i}
            src={item.image}
            alt={`Thumb ${i}`}
            onClick={() => {
              changeImage(i);
            }}
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
