"use client";

import type { CalendarProps } from "antd";
import { Calendar } from "antd";
import type { Dayjs } from "dayjs";
import Image from "next/image";
import React from "react";
import styles from "./schedule.module.scss";

const onPanelChange = (value: Dayjs, mode: CalendarProps<Dayjs>["mode"]) => {
  console.log(value.format("YYYY-MM-DD"), mode);
};

export default function Schedule() {
  const wrapperStyle: React.CSSProperties = {
    width: 400,
    // border: `1px solid ${token.colorBorderSecondary}`,
    // borderRadius: token.borderRadiusLG,
  };
  return (
    <div className={styles.container}>
      <div className={styles.divTag}>
        <div style={wrapperStyle}>
          <Calendar fullscreen={false} onPanelChange={onPanelChange} />
        </div>
      </div>
      <div className={styles.schedule}>
        <span>스케줄</span>
        <ul>
          <li>
            <Image
              src="/images/Ellipse.png"
              alt="ellipse"
              width={10}
              height={10}
            />
            한식 강좌
          </li>
          <hr />
          <li>
            <Image
              src="/images/Ellipse.png"
              alt="ellipse"
              width={10}
              height={10}
            />
            한식 강좌
          </li>
          <hr />
          <li>
            <Image
              src="/images/Ellipse.png"
              alt="ellipse"
              width={10}
              height={10}
            />
            한식 강좌
          </li>
          <hr />
          <li>
            <Image
              src="/images/Ellipse.png"
              alt="ellipse"
              width={10}
              height={10}
            />
            한식 강좌
          </li>
          <hr />
          <li>
            <Image
              src="/images/Ellipse.png"
              alt="ellipse"
              width={10}
              height={10}
            />
            한식 강좌
          </li>
          <hr />
          <li>
            <Image
              src="/images/Ellipse.png"
              alt="ellipse"
              width={10}
              height={10}
            />
            한식 강좌
          </li>
          <hr />
        </ul>
      </div>
    </div>
  );
}
