import { CreateCourseRequest } from "@/types/course";
import { Input } from "antd";
import { Controller, useFormContext } from "react-hook-form";

// string 값만 뽑아내는 유틸 타입
export type StringKeys<T> = {
  [K in keyof T]: T[K] extends string ? K : never;
}[keyof T];

// TextFormProps 에 적용
interface TextFormProps {
  name: StringKeys<CreateCourseRequest>;
  placeholder: string;
}

export default function TextForm({ name, placeholder }: TextFormProps) {
  const {
    control,
    formState: { errors },
  } = useFormContext<CreateCourseRequest>();

  return (
    <div style={{ marginBottom: 12 }}>
      {/* <label>{label}</label> */}
      <Controller
        name={name}
        control={control}
        rules={{ required: placeholder }}
        render={({ field }) => (
          <Input
            {...field}
            placeholder={placeholder}
            status={errors[name] ? "error" : ""}
            variant="underlined"
          />
        )}
      />
      {errors[name] && (
        <p style={{ color: "red" }}>{errors[name]?.message as string}</p>
      )}
    </div>
  );
}
