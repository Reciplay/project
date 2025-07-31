import styles from "./coverImage.module.scss";

interface CoverImageProps {
  props: {
    image: string;
  };
}

export default function CoverImage({ props }: CoverImageProps) {
  return (
    <div
      className={styles.coverWrapper}
      style={{
        backgroundImage: `url(${props.image})`,
      }}
    />
  );
}
