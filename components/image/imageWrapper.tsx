import { IMAGETYPE } from "@/types/image";
import styles from "./imageWrapper.module.scss";
import Image from "next/image";
import { HTMLAttributes } from "react";

interface ImageWrapperProps extends HTMLAttributes<HTMLDivElement> {
  src: string; // 이미지 주소 url
  alt: string;
  type?: IMAGETYPE; // optional로 처리하면 썸네일용 등도 대응 가능
  className?: string; // 외부에서 className 덮어쓰기 허용
}

const typeClassMap: Record<IMAGETYPE, string> = {
  [IMAGETYPE.FEAUTRED_MAIN]: "featured_main",
  [IMAGETYPE.FEATURED_THUMNAIL]: "featured_thumbnail",
  [IMAGETYPE.BANNER]: "banner",
  [IMAGETYPE.CARD]: "card",
  [IMAGETYPE.PROFILE]: "profile",
};

export default function ImageWrapper({
  src,
  alt,
  type,
  className = "",
  ...restProps
}: ImageWrapperProps) {
  const typeClass = type !== undefined ? styles[typeClassMap[type]] : "";

  return (
    <div
      className={`${styles.wrapper} ${typeClass} ${className}`}
      {...restProps}
    >
      <Image
        className={styles.image}
        src={src}
        alt={alt}
        fill
        style={{ objectFit: "cover" }}
      />
    </div>
  );
}
