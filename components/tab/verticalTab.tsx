"use client";

import React, { useState } from "react";
import { Tabs } from "antd";
import type { TabsProps } from "antd";
import { Course } from "@/config/sampleCourse";
import BaseInput from "../input/baseInput";
import styles from "./verticalTab.module.scss";

interface VerticalTabProps {
  course: Course[];
}

export default function VerticalTab({ course }: VerticalTabProps) {
  const [selected, setSelected] = useState<Course>(course[0]);

  const items: TabsProps["items"] = course.map((c) => ({
    key: c.key,
    label: c.label,
  }));

  const handleChange = (key: string) => {
    const found = course.find((c) => c.key === key);
    if (found) setSelected(found);
  };

  return (
    <div style={{ display: "flex", gap: 24 }}>
      {/* 왼쪽: 수직 탭 */}
      <Tabs
        tabPosition="left"
        defaultActiveKey="1"
        items={items}
        onChange={handleChange}
        className={styles.tabContainer} // 스타일 연결 필수!
        tabBarGutter={4}
      />
      {/* <Tabs
        // tabBarStyle={{
        //   color: "blue",
        //   fontSize: "16px",
        //   width: "150px",
        //   textOverflow: "ellipsis",
        // }}
        tabBarGutter={8}
        tabPosition="left"
        defaultActiveKey="1"
        style={{ width: 120 }}
        items={items}
        onChange={handleChange}
      /> */}
      {/* 오른쪽: 선택된 강좌 상세 */}
      <div
        style={{
          flex: 1,
          padding: "12px 24px",
          border: "1px solid #ddd",
          borderRadius: 8,
        }}
      >
        <h2>강좌 명</h2>
        <BaseInput
          placeholder="강좌명을 입력해주세요."
          type=""
          value={selected.label}
        />
        <h2>강좌 분야</h2>
        {/* 드롭박스로 처리해야함 */}
        <BaseInput
          placeholder="분야를 선택해주세요."
          type=""
          value={selected.category}
        />

        {/* <p>
          <strong>기간:</strong> {selected.start_date} ~ {selected.end_date}
        </p> */}
        <h2>강좌 소개</h2>
        {/* 드롭박스로 처리해야함 */}
        <BaseInput
          placeholder="강좌를 소개해주세요,."
          type=""
          value={selected.introduce}
        />
        <h2>강좌 요약</h2>
        {/* 드롭박스로 처리해야함 */}
        <BaseInput
          placeholder="강좌를 요약해주세요,."
          type=""
          value={selected.bio}
        />
      </div>
    </div>
  );
}
