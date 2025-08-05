import React from "react";
import { Rate } from "antd";

interface StarProps {
  value: number;
}

export default function Star({ value }: StarProps) {
  return <Rate disabled defaultValue={value} />;
}
