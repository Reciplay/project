"use client";

import restClient from "@/lib/axios/restClient";
import { ApiResponse } from "@/types/apiResponse";
import { User } from "@/types/user";
import { useEffect, useRef, useState } from "react";

export function useProfile() {
  const [userData, setUserData] = useState<User | null>(null);

  // 수정용 form 상태
  const [form, setForm] = useState({
    name: "",
    job: "",
    birthDate: "",
    gender: 0,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState("");

  // 프로필 이미지 관련
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  const [isModalOpen, setIsModalOpen] = useState(false);

  // ✅ 초기 데이터 불러오기
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await restClient.get<ApiResponse<User>>("/user/profile", {
          requireAuth: true,
        });
        const data = res.data.data;
        setUserData(data);
        setForm({
          name: data.name,
          job: data.job,
          birthDate: data.birthDate,
          gender: data.gender,
        });
        setPreviewUrl(data.profileImage.presignedUrl); // 초기 이미지 설정
      } catch (e) {
        console.error("프로필 불러오기 실패:", e);
        // setUserData(sampleUser.data);
      }
    };
    fetchProfile();
  }, []);

  // ✅ 기본 정보 수정 핸들러
  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const toggleEdit = () => setIsEditing((prev) => !prev);

  const saveProfile = async () => {
    setError("");
    try {
      await restClient.put(
        "/user/profile",
        {
          name: form.name,
          job: form.job,
          birthDate: form.birthDate,
          gender: form.gender,
        },
        { requireAuth: true }
      );
      alert("프로필이 수정되었습니다.");
      setUserData((prev) =>
        prev
          ? {
              ...prev,
              name: form.name,
              job: form.job,
              birthDate: form.birthDate,
              gender: form.gender,
            }
          : prev
      );
      setIsEditing(false);
    } catch (err) {
      console.error("❌ 프로필 수정 실패:", err);
      setError("프로필 수정 중 오류가 발생했습니다.");
    }
  };

  // ✅ 이미지 선택
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file)); // 미리보기용 blob URL
    }
  };

  // ✅ 이미지 업로드
  const uploadProfileImage = async () => {
    if (!selectedFile) return;
    const formData = new FormData();
    formData.append("profileImage", selectedFile);

    try {
      const res = await restClient.post("/user/profile/photo", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        requireAuth: true,
      });
      alert("프로필 이미지가 변경되었습니다!");
      setIsModalOpen(false);
      // 성공 후 서버 이미지 반영
      setUserData((prev) =>
        prev
          ? {
              ...prev,
              profileImage: {
                ...prev.profileImage,
                presignedUrl: previewUrl,
              },
            }
          : prev
      );
    } catch (err) {
      console.error("❌ 이미지 업로드 실패:", err);
      alert("이미지 업로드 중 오류가 발생했습니다.");
    }
  };

  return {
    userData,
    form,
    isEditing,
    error,
    handleChange,
    toggleEdit,
    saveProfile,
    previewUrl,
    selectedFile,
    fileInputRef,
    handleFileSelect,
    uploadProfileImage,
    isModalOpen,
    setIsModalOpen,
  };
}
