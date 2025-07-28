import NavBar from "@/components/nav/navBar";
import SideBar from "@/components/nav/sideBar";
import styles from "./layout.module.scss";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}
