import { CreateCourseRequest } from "@/types/course";
import { Radio, RadioChangeEvent } from "antd";
import { Controller, useFormContext } from "react-hook-form";
import styles from "./categoryForm.module.scss";
import { StringKeys } from "./textForm";

interface CategoryFormProps {
  name: StringKeys<CreateCourseRequest>;
  label: string;
}

export default function CategoryForm({ name, label }: CategoryFormProps) {
  const {
    control,
    formState: { errors },
  } = useFormContext<CreateCourseRequest>();

  return (
    <div style={{ marginBottom: 12 }}>
      <div className={styles.title}>{label}</div>
      <div>
        <Controller
          name={name}
          control={control}
          rules={{ required: `${label}을(를) 선택해주세요` }}
          render={({ field }) => (
            <>
              <Radio.Group
                {...field}
                onChange={(e: RadioChangeEvent) =>
                  field.onChange(e.target.value)
                }
                style={{ marginTop: 8 }}
              >
                <Radio.Button value="Korean">한식</Radio.Button>
                <Radio.Button value="Japanese">일식</Radio.Button>
                <Radio.Button value="Chinese">중식</Radio.Button>
                <Radio.Button value="Western">양식</Radio.Button>
                <Radio.Button value="Bakery">제과</Radio.Button>
                <Radio.Button value="Others">기타</Radio.Button>
              </Radio.Group>
              {errors[name] && (
                <p style={{ color: "red", marginTop: 4 }}>
                  {errors[name]?.message as string}
                </p>
              )}
            </>
          )}
        />
      </div>
    </div>
  );
}
