"use client";

import BaseButton from "@/components/button/baseButton";
import restClient from "@/lib/axios/restClient";
import { useInstructorStore } from "@/stores/instructorStore";
import { ApiResponse } from "@/types/apiResponse";
import { User } from "@/types/user";
import { useCallback, useEffect, useState } from "react";
import Career from "./__components/career";
import Certificate from "./__components/certificate";
import Introduction from "./__components/introduction";
import ProfileForm from "./__components/profileForm"; // 맨 위에 import 추가
import styles from "./page.module.scss";

export default function Page() {
  const [basicProfile, setProfile] = useState<{
    name: string;
    genderBirth: string;
    email: string;
    job: string;
  }>({
    name: "이지언",
    genderBirth: "여 2000 (25세)",
    email: "ssafyfavorait@example.com",
    job: "양식 강사",
  });
  const { profile, introduction, certificates, careers, coverImageFile } =
    useInstructorStore();

  const handleSave = async () => {
    try {
      if (!coverImageFile) {
        alert("커버 이미지를 선택해주세요.");
        return;
      }

      // 백엔드 DTO에 맞춰 키 매핑 (certificates -> licenses)
      const instructorProfilePayload = {
        address: profile.address,
        phoneNumber: profile.phoneNumber,
        introduction: introduction ?? "",
        licenses: (certificates ?? []).map((c) => ({
          licenseId: c.id,
          licenseName: c.licenseName,
          institution: c.institution,
          acquisitionDate: c.acquisitionDate, // YYYY-MM-DD
          grade: c.grade,
        })),
        careers: (careers ?? []).map((k) => ({
          careerId: k.id,
          companyName: k.companyName,
          position: k.position,
          jobDescription: k.jobDescription,
          startDate: k.startDate, // YYYY-MM-DD
          endDate: k.endDate, // YYYY-MM-DD
        })),
      };

      console.log(instructorProfilePayload);
      const fd = new FormData();
      // 파일 파트 이름은 @RequestPart("coverImage")와 동일해야 함
      fd.append("coverImage", coverImageFile);
      // json 파트도 @RequestPart('instructorProfile')와 동일
      fd.append(
        "instructorProfile",
        new Blob([JSON.stringify(instructorProfilePayload)], {
          type: "application/json",
        }),
      );
      // ✅ 실제 백엔드 경로로 교체 (예: /api/v1/instructor)
      // restClient가 axios 래퍼라면, FormData 전달 시 boundary 헤더는 자동으로 붙습니다.
      const res = await restClient.post("/user/instructor", fd, {
        requireAuth: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log(res);

      alert("등록 완료");

      // router.push("/instructor/edit");
    } catch (e) {
      console.error(e);
      alert("등록 실패");
    }
  };

  // 기본 정보 가져오는 함수 백엔드 api 요청
  const fetchProfile = useCallback(async () => {
    try {
      const { data } = await restClient.get<ApiResponse<User>>(
        "/user/profile",
        {
          requireAuth: true,
        },
      );

      const { name, job, birthDate, gender, email } = data.data;
      const genderText = gender === 0 ? "여" : "남";
      const age = calculateAge(birthDate);

      setProfile({
        name,
        genderBirth: `${genderText} ${formatBirth(birthDate)} (${age}세)`,
        email,
        job,
      });
    } catch (e) {
      console.error("프로필 불러오기 실패", e);
      setProfile({
        name: "이지언",
        genderBirth: "여 2000 (25세)",
        email: "ssafyfavorait@example.com",
        job: "양식 강사",
      });
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // 만나이 계산 함수
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

  /**
   * 생년월일 문자열에서 연도를 추출해 네 자리 숫자로 반환
   * 예: "2000-08-04" → "2000"
   *
   * @param birthDateStr YYYY-MM-DD 형식의 생년월일 문자열
   * @returns 연도 (예: "2000")
   */
  const formatBirth = (birthDateStr: string): string => {
    const birth = new Date(birthDateStr);
    return birth.getFullYear().toString(); // 예: "2000"
  };

  return (
    <div className={styles.container}>
      <div className={styles.coverImage}></div>

      <div className={styles.infoContainer}>
        <ProfileForm value={basicProfile} />

        <Introduction></Introduction>
        <Certificate></Certificate>
        <Career />
        <div className={styles.buttonWrapper}>
          <BaseButton
            title="취소"
            variant="custom"
            type="button"
            size="sm"
            color="white"
            className={styles.wishButton}
          />
          <BaseButton
            title="저장"
            variant="custom"
            type="button"
            size="sm"
            className={styles.wishButton}
            onClick={handleSave}
          />
        </div>
      </div>
    </div>
  );
}
