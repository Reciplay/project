import { forwardRef } from "react";
import styles from "./notices.module.scss";

const Notices = forwardRef<HTMLDivElement>((_, ref) => {
  return (
    <div className={styles.section} ref={ref}>
      <h2>공지사항</h2>
      <p>
        강의 학습규정
        <br />
        *강의 영상 공개일은 예고 없이 변경될 수 있습니다.
        <br />
        *상세페이지 내 일부 이미지는 수강생의 이해를 돕기 위한 참고
        이미지입니다.
        <br />* 상황에 따라 사전 공지 없이 조기 마감되거나 연장될 수 있습니다.
        <br />* 사전 예약 강의의 경우, 강의 영상은 공개 일정에 따라 순차적으로
        제작되어 오픈되며, 1차 영상 공개일이 수강시작일이 됩니다.
        <br />* 수강 신청 완료하시면, 마이페이지를 통해 바로 수강이 가능합니다.
        <br />총 학습기간:
        <br />– 정상 수강기간(유료 수강기간) 최초 10일, 무료 수강 기간은
        11일부터 이후로 무제한이며, 유료 수강기간과 무료 수강기간 모두 동일하게
        시청 가능합니다.
        <br />– 수강시작일: 수강 시작일은 결제일로부터 기간이 산정되며, 결제를
        완료하시면 마이페이지를 통해 바로 수강이 가능합니다. (사전 예약 강의는
        1차 강의 오픈일)
        <br />– 레시플레이의 사정으로 수강시작이 늦어진 경우에는 해당 일정 만큼
        수강 시작일이 연기됩니다.
      </p>
    </div>
  );
});

Notices.displayName = "Notices";
export default Notices;
