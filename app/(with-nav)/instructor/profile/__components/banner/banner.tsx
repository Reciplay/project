import styles from "./banner.module.scss";

interface BannerProps {
  imageUrl: string;
}

export default function Banner({ imageUrl }: BannerProps) {
  return (
    <div
      className={styles.bannerWrapper}
      style={{
        backgroundImage: `url(${imageUrl})`,
      }}
    />
  );
}
