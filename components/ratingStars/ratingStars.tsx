// components/StarEditable.tsx
import { Rate } from "antd";

interface StarEditableProps {
  value: number;
  onChange: (value: number) => void;
  disabled: boolean;
}

export default function RatingStars({
  value,
  onChange,
  disabled,
}: StarEditableProps) {
  return (
    <Rate allowHalf value={value} onChange={onChange} disabled={disabled} />
  );
}
