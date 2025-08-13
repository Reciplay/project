"use client";

import { Tabs } from "antd";
import React from "react";

type TabItem = { key: string; label: string; content: React.ReactNode };

interface Props {
  tabs: TabItem[];
  defaultActiveKey?: string;
  onChangeTab?: (key: string) => void;
  type?: "card" | "line" | "editable-card";
}

export default function HorizontalTab({
  tabs,
  defaultActiveKey,
  onChangeTab,
  type = "card",
}: Props) {
  return (
    <Tabs
      type={type}
      defaultActiveKey={defaultActiveKey ?? tabs[0]?.key}
      onChange={onChangeTab}
      items={tabs.map((t) => ({
        key: t.key,
        label: t.label,
        children: t.content,
      }))}
    />
  );
}
