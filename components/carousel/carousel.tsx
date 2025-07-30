'use client';

import React from 'react';
import { Carousel as AntdCarousel } from 'antd';
import styles from './carousel.module.scss';
import Image from 'next/image';

const contentStyle: React.CSSProperties = {
  margin: 0,
  height: '300px',
  color: '#fff',
  lineHeight: '160px',
  textAlign: 'center',
  background: '#364d79',
};

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
          style={{ objectFit: 'cover' }}
        />
      </AntdCarousel>
    </div>
  );
}
