"use client";

import type { TabsProps } from "antd";
import { Alert, Empty, Spin, Tabs } from "antd";
import React, { useEffect, useMemo, useState } from "react";
import styles from "./verticalTab.module.scss";

type VerticalTabProps<T> = {
  data: T[];
  getKey: (item: T) => string;
  getLabel: (item: T) => string;
  renderContent: (item: T) => React.ReactNode;

  // ✅ 추가: 상태 처리
  loading?: boolean;
  error?: string;
  emptyText?: string;

  // 선택 변경 알림이 필요하면
  onChange?: (key: string, item: T | null) => void;
};

export default function VerticalTab<T>({
  data,
  getKey,
  getLabel,
  renderContent,
  loading = false,
  error = "",
  emptyText = "데이터가 없습니다.",
  onChange,
}: VerticalTabProps<T>) {
  // 현재 선택된 key를 보관 (데이터 변경에도 안정적으로 동작)
  const firstKey = useMemo(
    () => (data[0] ? getKey(data[0]) : ""),
    [data, getKey],
  );
  const [activeKey, setActiveKey] = useState<string>(firstKey);

  // 데이터가 바뀌었을 때, 현재 activeKey가 유효하지 않으면 첫 항목으로 보정
  useEffect(() => {
    if (!data.length) {
      setActiveKey("");
      onChange?.("", null);
      return;
    }
    const exists = data.some((i) => getKey(i) === activeKey);
    if (!exists) {
      setActiveKey(firstKey);
      onChange?.(firstKey, data[0] ?? null);
    }
  }, [data, activeKey, firstKey, getKey, onChange]);

  const items: TabsProps["items"] = useMemo(
    () =>
      data.map((item) => ({
        key: getKey(item),
        label: getLabel(item),
      })),
    [data, getKey, getLabel],
  );

  const selected = useMemo(
    () => data.find((i) => getKey(i) === activeKey) ?? null,
    [data, activeKey, getKey],
  );

  const handleChange = (key: string) => {
    setActiveKey(key);
    const found = data.find((i) => getKey(i) === key) ?? null;
    onChange?.(key, found);
  };

  // ✅ 상태 핸들링 (좌측 탭 + 우측 패널 모두 동일한 박스 안에서 처리)
  if (loading) {
    return (
      <div className={styles.loadingWrap}>
        <Spin tip="불러오는 중...">
          <div />
        </Spin>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorWrap}>
        <Alert type="error" message="오류" description={error} showIcon />
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className={styles.emptyWrap}>
        <Empty description={emptyText} />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Tabs
        tabPosition="left"
        activeKey={activeKey}
        items={items}
        onChange={handleChange}
        className={styles.tabContainer}
        tabBarGutter={4}
      />
      <div className={styles.contentPanel}>
        {selected ? renderContent(selected) : <Empty description={emptyText} />}
      </div>
    </div>
  );
}
