"use client";

import restClient from "@/lib/axios/restClient";
import { useInstructorStore } from "@/stores/instructorStore";
import { ApiResponse } from "@/types/apiResponse";
import { User } from "@/types/user";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export function useInstructorRegister() {
  const router = useRouter();

  const [basicProfile, setBasicProfile] = useState<{
    name: string;
    genderBirth: string;
    email: string;
    job: string;
  }>({
    name: "",
    genderBirth: "",
    email: "",
    job: "",
  });

  const { profile, introduction, certificates, careers, coverImageFile } =
    useInstructorStore();

  /** 만나이 계산 */
  const calculateAge = (birthDateStr: string): number => {
    const birth = new Date(birthDateStr);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  /** 출생 연도 추출 */
  const formatBirth = (birthDateStr: string): string => {
    const birth = new Date(birthDateStr);
    return birth.getFullYear().toString();
  };

  /** 프로필 조회 */
  const fetchProfile = useCallback(async () => {
    try {
      const { data } = await restClient.get<ApiResponse<User>>(
        "/user/profile",
        { requireAuth: true },
      );

      const { name, job, birthDate, gender, email } = data.data;
      const genderText = gender === 0 ? "여" : "남";
      const age = calculateAge(birthDate);

      setBasicProfile({
        name,
        genderBirth: `${genderText} ${formatBirth(birthDate)} (${age}세)`,
        email,
        job,
      });
    } catch (e) {
      console.error("프로필 불러오기 실패", e);
      setBasicProfile({
        name: "이지언",
        genderBirth: "여 2000 (25세)",
        email: "ssafyfavorait@example.com",
        job: "양식 강사",
      });
    }
  }, []);

  /** 저장 */
  const handleSave = async () => {
    try {
      if (!coverImageFile) {
        alert("커버 이미지를 선택해주세요.");
        return;
      }

      const instructorProfilePayload = {
        address: profile.address,
        phoneNumber: profile.phoneNumber,
        introduction: introduction ?? "",
        licenses: (certificates ?? []).map((c) => ({
          licenseId: c.id,
          licenseName: c.licenseName,
          institution: c.institution,
          acquisitionDate: c.acquisitionDate,
          grade: c.grade,
        })),
        careers: (careers ?? []).map((k) => ({
          careerId: k.id,
          companyName: k.companyName,
          position: k.position,
          jobDescription: k.jobDescription,
          startDate: k.startDate,
          endDate: k.endDate,
        })),
      };

      const fd = new FormData();
      fd.append("coverImage", coverImageFile);
      fd.append(
        "instructorProfile",
        new Blob([JSON.stringify(instructorProfilePayload)], {
          type: "application/json",
        }),
      );

      const res = await restClient.post("/user/instructor", fd, {
        requireAuth: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log(res);
      alert("등록 완료");
      router.push("/instructor/edit");
    } catch (e) {
      console.error(e);
      alert("등록 실패");
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return {
    basicProfile,
    fetchProfile,
    handleSave,
  };
}
