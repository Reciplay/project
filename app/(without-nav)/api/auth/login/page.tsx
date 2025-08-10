import { AUTH } from "@/config/const";
import LogoWithDesc from "../../../../../components/text/logoWithDesc/logoWithDesc";
import AuthImage from "../__components/authImage/authImage";
import Separator from "../__components/separator/separator";
import SNS from "../__components/sns/sns";
import LoginForm from "./__components/loginForm/loginForm";
import styles from "./page.module.scss";

export default function Page() {
  return (
    <>
      <div className={styles.left}>
        <LogoWithDesc desc={AUTH.LOGINDESC} />
        {/* !TODO 로그인 버튼을 눌렀을 때, 로그인 중,,, 으로 바뀌면서 disabled가 되는지 확인 */}
        <LoginForm />
        <Separator />
        <SNS props={{ isLogin: true }} />
      </div>
      <div className={styles.right}>
        <AuthImage />
      </div>
    </>
  );
}
