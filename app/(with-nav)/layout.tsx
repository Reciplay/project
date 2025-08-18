"use client";

import NavBar from "@/components/nav/navBar";
import SideBar from "@/components/nav/sideBar";
import { ScrollContainerContext } from "@/contexts/ScrollContainerContext";
import { useRef } from "react";
import styles from "./layout.module.scss";

export default function Layout({ children }: { children: React.ReactNode }) {
  const mainRef = useRef<HTMLElement>(null!);

  return (
    <div className={styles.layout}>
      <NavBar />
      <div className={styles.body}>
        <SideBar />
        <main
          className={styles.main}
          ref={mainRef as React.RefObject<HTMLElement>}
        >
          <ScrollContainerContext.Provider value={mainRef}>
            <div className={styles.mainInner}>{children}</div>
          </ScrollContainerContext.Provider>
        </main>
      </div>
    </div>
  );
}
