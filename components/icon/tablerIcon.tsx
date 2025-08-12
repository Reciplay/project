import * as TablerIcons from "@tabler/icons-react";
import React from "react";

interface Props {
  name: string;
  size?: number;
  filled?: boolean; // filled prop 추가
  className?: string;
}

export default function TablerIcon({
  name,
  size = 20,
  filled = false,
  className,
}: Props) {
  const iconKey = `Icon${name}${
    filled ? "Filled" : ""
  }` as keyof typeof TablerIcons;
  const Icon = TablerIcons[iconKey] as React.ElementType | undefined;

  if (!Icon) {
    console.warn(`❗Icon not found: ${iconKey}`);
    return null;
  }
  return Icon ? <Icon size={size} className={className} /> : null;
}
