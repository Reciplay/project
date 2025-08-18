"use client";

import { sampleInstructor } from "@/config/sampleInstructor";
import restClient from "@/lib/axios/restClient";
import { ApiResponse } from "@/types/apiResponse";
import { Instructor } from "@/types/instructor";
import { useEffect, useState } from "react";

export function useInstructorProfile(instructorId?: string) {
  const [instructor, setInstructor] = useState<Instructor | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    if (!instructorId) {
      setLoading(false);
      setMessage("유효하지 않은 강사 ID입니다.");
      return;
    }

    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await restClient.get<ApiResponse<Instructor>>(
          "/user/instructor/profile",
          {
            params: { instructorId: Number(instructorId) },
            requireAuth: true,
          },
        );

        if (!alive) return;

        if (res.status === 400) {
          setMessage(res.data.message);
          setInstructor(null);
          return;
        }

        const data = res.data.data;
        if (!data?.name) {
          setInstructor(sampleInstructor);
          return;
        }

        setInstructor(data);
      } catch {
        if (!alive) return;
        // 실패 시 더미 데이터
        setInstructor(sampleInstructor);
      } finally {
        if (alive) setLoading(false);
      }
    };

    fetchProfile();
    return () => {
      alive = false;
    };
  }, [instructorId]);

  return { instructor, loading, message };
}
