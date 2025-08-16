import styles from "./coverImage.module.scss";

interface CoverImageProps {
  props: {
    image?: string; // 이미지가 없을 수도 있으니까 optional
  };
}

export default function CoverImage({ props }: CoverImageProps) {
  const hasImage = Boolean(props.image);

  return (
    <div
      className={styles.coverWrapper}
      style={
        hasImage
          ? { backgroundImage: `url(${props.image})` }
          : { backgroundColor: "#f5f5f5" } // ✅ 기본 색상
      }
    />
  );
}
