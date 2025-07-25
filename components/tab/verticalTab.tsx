"use client";

import React, { useState } from "react";
import { Tabs } from "antd";
import type { TabsProps } from "antd";
import styles from "./verticalTab.module.scss";

type VerticalTabProps<T> = {
  data: T[];
  getKey: (item: T) => string;
  getLabel: (item: T) => string;
  renderContent: (item: T) => React.ReactNode;
};

export default function VerticalTabs<T>({
  data,
  getKey,
  getLabel,
  renderContent,
}: VerticalTabProps<T>) {
  const [selected, setSelected] = useState<T>(data[0]);

  const items: TabsProps["items"] = data.map((item) => ({
    key: getKey(item),
    label: getLabel(item),
  }));

  const handleChange = (key: string) => {
    const found = data.find((item) => getKey(item) === key);
    if (found) setSelected(found);
  };

  return (
    <div style={{ display: "flex", gap: 24 }}>
      <Tabs
        tabPosition="left"
        defaultActiveKey={getKey(data[0])}
        items={items}
        onChange={handleChange}
        className={styles.tabContainer}
        tabBarGutter={4}
      />
      <div
        style={{
          flex: 1,
          padding: "12px 24px",
          border: "1px solid #ddd",
          borderRadius: 8,
        }}
      >
        {renderContent(selected)}
      </div>
    </div>
  );
}
