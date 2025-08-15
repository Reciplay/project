"use client";

import styles from "./emptyState.module.scss";

interface Props {
  title: string;
  description?: string;
  primaryText: string;
  secondaryText?: string;
  onPrimary: () => void;
  onSecondary?: () => void;
  // 필요하면 아이콘/일러스트 커스터마이즈
  illustrationSrc?: string;
}

export default function EmptyState({
  title,
  description,
  primaryText,
  secondaryText,
  onPrimary,
  onSecondary,
}: Props) {
  return (
    <div className={styles.wrapper}>
      {/* <div className={styles.illustration}>
        <Image src={illustrationSrc} alt="" fill sizes="96px" />
      </div> */}
      <h3 className={styles.title}>{title}</h3>
      {description && <p className={styles.desc}>{description}</p>}
      <div className={styles.actions}>
        <button type="button" className={styles.primary} onClick={onPrimary}>
          {primaryText}
        </button>
        {secondaryText && onSecondary && (
          <button
            type="button"
            className={styles.secondary}
            onClick={onSecondary}
          >
            {secondaryText}
          </button>
        )}
      </div>
    </div>
  );
}
