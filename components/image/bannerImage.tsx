import styles from "./bannerImage.module.scss";

interface BannerProps {
  imageUrl: string;
}

export default function BannerImage({ imageUrl }: BannerProps) {
  return (
    <div
      className={styles.bannerWrapper}
      style={{
        backgroundImage: `url(${imageUrl})`,
      }}
    />
  );
}
