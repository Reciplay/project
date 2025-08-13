/*
    CustomButton 컴포넌트
    ---------------------
    다양한 스타일과 크기를 지원하는 재사용 가능한 버튼 컴포넌트.
    variant, size, color, font 옵션을 props로 받아서 스타일을 동적으로 적용하며,
    필요 시 링크 형태(variant="link")로도 표시 가능하다.

    주요 Props:
    - title: 버튼에 표시할 텍스트
    - color: 버튼 배경/텍스트 색상 ("black" | "red" | "green" | "blue" | "white")
    - type: HTML button type ("button" | "submit" | "reset")
    - variant: 스타일 유형
        - "default": 기본 버튼 스타일
        - "custom": 그림자, 둥근 모서리 적용
        - "outline": 테두리만 있는 버튼
        - "ghost": 배경 없는 버튼
        - "link": 밑줄 있는 링크 형태 버튼
    - size: 버튼 크기
        - "sm": 작은 버튼
        - "md": 중간 버튼
        - "lg": 큰 버튼
        - "inf": 너비 100% 확장 버튼
    - className: 외부에서 전달하는 추가 클래스
    - onClick: 클릭 이벤트 핸들러

    사용 예시:
    <CustomButton title="로그인" variant="default" color="black" fontSize="1.4rem" fontWeight="600" />
    <CustomButton title="회원가입" variant="link" onClick={handleClick} fontFamily="var(--font-protest)" />
*/

import classNames from "classnames";
import styles from "./customButton.module.scss";

type ButtonType = "button" | "submit" | "reset";

interface CustomButtonProps {
  title: string;
  color?: "black" | "red" | "green" | "blue" | "white";
  type?: ButtonType;
  variant?: "default" | "custom" | "outline" | "ghost" | "link";
  size?: "sm" | "md" | "lg" | "inf";
  fontSize?: string;
  fontWeight?: number | string;
  fontFamily?: string;
  className?: string;
  onClick?: VoidFunction;
}

export default function CustomButton({
  title,
  type = "button",
  color = "black",
  variant = "default",
  size = "md",
  className,
  onClick,
  ...props
}: CustomButtonProps) {
  return (
    <button
      type={type}
      className={classNames(
        styles.container,
        styles[size],
        styles[variant],
        styles[color],
        className,
      )}
      onClick={onClick}
      {...props}
    >
      {title}
    </button>
  );
}
