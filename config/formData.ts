interface FieldMap {
  email: string;
  password: string;
  nickname: string;
  confirmPassword: string;
}

type FieldName = keyof FieldMap;

interface Rule {
  required?: string | boolean;
  minLength?: { value: number; message: string };
  maxLength?: { value: number; message: string };
  pattern?: { value: RegExp; message: string };
  validate?: (value) => string | boolean | undefined;
}

interface FieldConfig<T extends FieldName> {
  placeholder: string;
  type: React.InputHTMLAttributes<HTMLInputElement>["type"];
  rules: Rule;
}

export const formData: Record<FieldName, FieldConfig<FieldName>> = {
  email: {
    placeholder: "이메일",
    type: "email",
    rules: {
      required: "이메일은 필수입니다.",
      minLength: { value: 5, message: "이메일은 5자 이상 입력해주세요." },
      maxLength: { value: 30, message: "이메일은 30자 이하로 입력해주세요." },
      pattern: {
        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: "유효한 이메일 주소를 입력하세요.",
      },
    },
  },
  password: {
    placeholder: "비밀번호",
    type: "password",
    rules: {
      required: "비밀번호는 필수입니다.",
      // ! todo
      // minLength: { value: 8, message: "비밀번호는 8자 이상 입력해주세요." },
      // maxLength: { value: 20, message: "비밀번호는 20자 이하로 입력해주세요." },
      // pattern: {
      //   value: /^(?=.*[A-Za-z])(?=.*\d).+$/,
      //   message: "영어와 숫자를 모두 포함해야 합니다.",
      // },
    },
  },
  confirmPassword: {
    placeholder: "비밀번호 확인",
    type: "password",
    rules: {
      required: "비밀번호는 필수입니다.",
      // ! todo
      // minLength: { value: 8, message: "비밀번호는 8자 이상 입력해주세요." },
      // maxLength: { value: 20, message: "비밀번호는 20자 이하로 입력해주세요." },
      // pattern: {
      //   value: /^(?=.*[A-Za-z])(?=.*\d).+$/,
      //   message: "영어와 숫자를 모두 포함해야 합니다.",
      // },
    },
  },
  nickname: {
    placeholder: "닉네임",
    type: "text",
    rules: {
      required: "닉네임은 필수입니다.",
      minLength: { value: 2, message: "닉네임은 최소 2자 이상입니다." },
      maxLength: { value: 10, message: "닉네임은 최대 10자까지 가능합니다." },
    },
  },
};
