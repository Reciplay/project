import type { CreateCourseRequest } from "@/types/course";
import type { RadioChangeEvent } from "antd";
import type { Moment } from "moment";
import { useState } from "react";

export function useCreateCourseForm() {
  const [form, setForm] = useState<CreateCourseRequest>({
    courseName: "",
    courseStartDate: "",
    courseEndDate: "",
    instructorId: 0,
    enrollmentStartDate: "",
    enrollmentEndDate: "",
    category: "Korean",
    reviewCount: 0,
    averageReviewScore: 0,
    summary: "",
    maxEnrollments: 0,
    isEnrollment: false,
    description: "",
    level: 1,
    isZzim: false,
    isLive: false,
    announcement: "",
    isReviwed: false,
  });

  const onChangeText =
    (key: keyof CreateCourseRequest) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [key]: e.target.value }));
    };

  const onChangeNumber =
    (key: keyof CreateCourseRequest) => (value: number | null) => {
      setForm((prev) => ({ ...prev, [key]: value ?? 0 }));
    };

  const onSwitch = (key: keyof CreateCourseRequest) => (checked: boolean) => {
    setForm((prev) => ({ ...prev, [key]: checked }));
  };

  const onCategoryChange = (e: RadioChangeEvent) => {
    setForm((prev) => ({ ...prev, category: e.target.value }));
  };

  const onDateChange =
    (key: keyof CreateCourseRequest) => (date: Moment | null) => {
      setForm((prev) => ({
        ...prev,
        [key]: date ? date.format("YYYY-MM-DD") : "",
      }));
    };

  const handleSubmit = () => {
    // axios.post("/api/courses", form)
    console.log("전송할 payload:", form);
  };

  return {
    form,
    onChangeText,
    onChangeNumber,
    onSwitch,
    onCategoryChange,
    onDateChange,
    handleSubmit,
  };
}
