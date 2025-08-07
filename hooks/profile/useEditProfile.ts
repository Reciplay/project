"use client";

import restClient from "@/lib/axios/restClient";
import { useState } from "react";

interface InitialProfile {
  name: string;
  job: string;
  birth: string;
  gender: number;
}

export function useEditProfile(
  initialData: InitialProfile,
  onUpdate?: (newData: Partial<InitialProfile>) => void
) {
  const [isEditing, setIsEditing] = useState(false);

  const [form, setForm] = useState({
    name: initialData.name,
    job: initialData.job,
    birthDate: initialData.birth,
    gender: initialData.gender.toString(),
  });

  const [error, setError] = useState("");

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const toggleEdit = () => {
    setIsEditing((prev) => !prev);
  };

  const saveProfile = async () => {
    setError("");

    try {
      await restClient.put(
        "/user/profile",
        {
          name: form.name,
          job: form.job,
          birthDate: form.birthDate,
          gender: parseInt(form.gender),
        },
        { requireAuth: true }
      );

      alert("프로필이 수정되었습니다.");
      setIsEditing(false);

      // 🔥 부분 업데이트 전달
      onUpdate?.({
        name: form.name,
        job: form.job,
        birth: form.birthDate,
        gender: parseInt(form.gender),
      });
    } catch (err) {
      console.error("❌ 프로필 수정 실패:", err);
      setError("프로필 수정 중 오류가 발생했습니다.");
    }
  };

  return {
    isEditing,
    form,
    error,
    handleChange,
    toggleEdit,
    saveProfile,
  };
}
