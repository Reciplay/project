import NavBar from "@/components/nav/navBar";
import SideBar from "@/components/nav/sideBar";
import styles from "./layout.module.scss";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.layout}>
      <NavBar />
      <div className={styles.body}>
        <SideBar />
        <main className={styles.main}>{children}</main>
        <div className={styles.divTag}></div>
      </div>
    </div>
  );
}
