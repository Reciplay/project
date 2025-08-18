"use client";

import { Segmented } from "antd";
import { ReactNode, useState } from "react";

interface SegmentedToggleProps {
  options: string[];
  contents: ReactNode[];
}

export default function SegmentedToggle({
  options,
  contents,
}: SegmentedToggleProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const segmentOptions = options.map((label, index) => ({
    label,
    value: index,
  }));

  return (
    <div>
      <Segmented
        options={segmentOptions}
        value={selectedIndex}
        onChange={(val) => setSelectedIndex(val as number)}
        style={{ marginBottom: 16 }}
      />
      {/* 탭 콘텐츠 렌더링 */}
      <div>{contents[selectedIndex]}</div>
    </div>
  );
}
