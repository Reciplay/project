import styles from "./separator.module.scss";

export default function Separator() {
  return (
    <>
      <div className={styles.separator}>
        <span className={styles.line} />
        <span className={styles.or}>or</span>
        <span className={styles.line} />
      </div>
    </>
  );
}
