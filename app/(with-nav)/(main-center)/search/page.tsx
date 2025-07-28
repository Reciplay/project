import Image from "next/image";
import styles from "./page.module.scss";
import ListCard from "@/components/card/listCard";


export default function Page() {
  return (
    <div className={styles.container}>
      <ListCard />
      <ListCard />
      <ListCard />

    </div>
  )
}