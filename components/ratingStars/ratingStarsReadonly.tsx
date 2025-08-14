import { Rate } from "antd";

interface StarReadOnlyProps {
  value: number;
}

export default function RatingStarsReadonly({ value }: StarReadOnlyProps) {
  return <Rate disabled allowHalf value={value} />;
}
