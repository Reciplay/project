import styles from "./page.module.scss";

import LogoWithDesc from "../../../../../components/text/logoWithDesc/logoWithDesc";
import AuthImage from "../__components/authImage/authImage";
import Separator from "../__components/separator/separator";
import SNS from "../__components/sns/sns";

import { AUTH } from "@/config/const";
import SignupFormComponent from "./__components/signupForm/signupFormComponent";

export default function Page() {
  return (
    <>
      <div className={styles.left}>
        <AuthImage />
      </div>
      <div className={styles.right}>
        <LogoWithDesc desc={AUTH.SIGNUPDESC} />
        {/* 중복 확인이 안되는 중 */}
        <SignupFormComponent />
        <Separator />
        <SNS props={{ isLogin: false }} />
      </div>
    </>
  );
}
