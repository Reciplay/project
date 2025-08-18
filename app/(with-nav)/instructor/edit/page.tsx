"use client";

import BaseButton from "@/components/button/baseButton";
import restClient from "@/lib/axios/restClient";
import { useInstructorStore } from "@/stores/instructorStore";
import { ApiResponse } from "@/types/apiResponse";
import { User } from "@/types/user";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import Career from "./__components/career";
import Certificate from "./__components/certificate";
import Introduction from "./__components/introduction";
import ProfileForm from "./__components/profileForm";
import styles from "./page.module.scss"; // 동일 스타일 재사용 (경로는 실제 구조에 맞게 조정)

// 응답 타입 (간단 정의)
type InstructorProfileResponse = {
  name: string;
  profileImage: string;
  coverImage: string;
  introduction: string;
  licenses: Array<{
    id: number;
    licenseName: string;
    institution: string;
    acquisitionDate: string; // YYYY-MM-DD
    grade: number;
  }>;
  careers: Array<{
    id: number;
    companyName: string;
    position: string;
    jobDescription: string;
    startDate: string; // YYYY-MM-DD
    endDate: string; // YYYY-MM-DD
  }>;
  subscriberCount: number;
  isSubscribed: boolean;
};

export default function EditInstructorPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const instructorId = searchParams.get("instructorId");

  const {
    profile,
    setProfile,
    setIntroduction,
    setCertificates,
    setCareers,
    setCoverImageFile,
  } = useInstructorStore();

  const [basicProfile, setBasicProfile] = useState({
    name: "",
    genderBirth: "",
    email: "",
    job: "",
  });

  const [initialCoverImageUrl, setInitialCoverImageUrl] = useState<
    string | undefined
  >(undefined);

  const fetchUserBasic = useCallback(async () => {
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
      setBasicProfile({
        name,
        genderBirth: `${genderText} ${new Date(birthDate).getFullYear()} (${age}세)`,
        email,
        job: job ?? "",
      });
    } catch (e) {
      console.error("/user/profile 불러오기 실패", e);
    }
  }, []);

  const fetchInstructorProfile = useCallback(
    async (id: string) => {
      try {
        const { data } = await restClient.get<
          ApiResponse<InstructorProfileResponse>
        >("/user/instructor/profile", {
          params: { instructorId: id }, // 필수 파라미터
          requireAuth: true,
          headers: { "Content-Type": "application/json;charset=UTF-8" },
        });

        const p = data.data;

        // 스토어 선채움 (주소/전화번호는 응답 스키마에 없으므로 빈 값 유지 혹은 기존값 유지)
        setProfile({
          address: profile.address ?? "",
          phoneNumber: profile.phoneNumber ?? "",
        });

        setIntroduction(p.introduction ?? "");

        setCertificates(
          (p.licenses ?? []).map((l) => ({
            id: l.id,
            licenseName: l.licenseName,
            institution: l.institution,
            acquisitionDate: l.acquisitionDate,
            grade: l.grade ?? 0,
          })),
        );

        setCareers(
          (p.careers ?? []).map((c) => ({
            id: c.id,
            companyName: c.companyName,
            position: c.position,
            jobDescription: c.jobDescription,
            startDate: c.startDate,
            endDate: c.endDate,
          })),
        );

        // 커버 이미지 초기 표시 (Upload fileList preset은 ProfileForm에서 처리)
        if (p.coverImage) {
          setCoverImageFile(null); // 새 파일 아직 없음
          setInitialCoverImageUrl(p.coverImage);
        }

        // 이름도 응답에 있으니, 기본 프로필 이름이 비어있으면 보조로 채움
        setBasicProfile((prev) => ({
          ...prev,
          name: prev.name || p.name || "",
        }));
      } catch (e) {
        console.error("강사 프로필 불러오기 실패", e);
      }
    },
    [
      profile.address,
      profile.phoneNumber,
      setProfile,
      setIntroduction,
      setCertificates,
      setCareers,
      setCoverImageFile,
    ],
  );

  useEffect(() => {
    // 필수 파라미터 체크
    if (!instructorId) return;

    // 1) 상단 카드용 기본 유저정보 (email/job/genderBirth 계산)
    fetchUserBasic();
    // 2) 강사 프로필 조회 → 스토어 선채움
    fetchInstructorProfile(instructorId);
  }, [instructorId, fetchUserBasic, fetchInstructorProfile]);

  useEffect(() => {
    if (!instructorId) return;
    fetchUserBasic();
    fetchInstructorProfile(instructorId);
  }, [instructorId, fetchUserBasic, fetchInstructorProfile]);

  const calculateAge = (birthDateStr: string): number => {
    const birth = new Date(birthDateStr);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age;
  };

  const handleSave = async () => {
    // TODO: 수정 API(put/patch) 연결 – 이 단계에선 선채움만 구현
    console.log("현재 스토어 상태로 저장 호출 예정");
  };

  return (
    <div className={styles.container}>
      <div className={styles.infoContainer}>
        <ProfileForm
          value={basicProfile}
          initialCoverImageUrl={initialCoverImageUrl}
        />
        <Introduction />
        <Certificate />
        <Career />
        <div className={styles.buttonWrapper}>
          <BaseButton
            title="취소"
            variant="custom"
            type="button"
            size="sm"
            color="white"
            className={styles.wishButton}
            onClick={() => router.back()}
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
