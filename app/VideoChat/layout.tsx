import styles from './layout.module.css';

export default function VideoChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className={styles.container}>{children}</div>;
}
