import Image from "next/image";
import { useMemo } from "react";

interface Props {
  name: string;
  size?: number; // 기본 20
  filled?: boolean; // -filled / -outline
  className?: string; // 아이콘 "래퍼"에 적용됨
}

function toKebab(name: string) {
  return name
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/[\s_]+/g, "-")
    .toLowerCase();
}

export default function CustomIcon({
  name,
  size = 20,
  filled = false,
  className,
}: Props) {
  const kebab = useMemo(() => toKebab(name), [name]);
  const src = `/icons/${kebab}-${filled ? "Filled" : "Outline"}.svg`;

  return (
    <span
      className={className}
      style={{
        position: "relative",
        display: "inline-flex",
        inlineSize: `${size}px`,
        blockSize: `${size}px`,
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
      aria-hidden
    >
      <Image src={src} alt={`${kebab} icon`} fill sizes={`${size}px`} />
    </span>
  );
}
