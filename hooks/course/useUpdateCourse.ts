import { getErrorMessage } from "@/lib/axios/error";
import restClient from "@/lib/axios/restClient";
import { ApiResponse } from "@/types/apiResponse";
import { useState } from "react";
import dayjs from "dayjs";

type FileOrUrl = File | string;

interface UpdateCourseRequest {
  requestCourseInfo: {
    courseId: number;
    title: string;
    enrollmentStartDate: string;
    enrollmentEndDate: string;
    categoryId: number;
    summary: string;
    maxEnrollments: number;
    description: string;
    level: number;
    announcement: string;
    canLearns: string[];
  };
  thumbnailImages: FileOrUrl[];
  courseCoverImage: FileOrUrl | null;
}

interface UpdateCourseResponse {
  courseId: number;
}

function guessFilenameFromUrl(url: string, fallback: string): string {
  try {
    const u = new URL(url);
    const name = u.pathname.split("/").pop() ?? "";
    return name || fallback;
  } catch {
    return fallback;
  }
}

async function urlToFile(url: string, fallbackName: string): Promise<File | null> {
  try {
    const res = await fetch(url);
    if (!res.ok) {
      console.warn(`Failed to fetch image from ${url}, skipping.`);
      return null;
    }
    const blob = await res.blob();
    return new File([blob], guessFilenameFromUrl(url, fallbackName), {
      type: blob.type || "application/octet-stream",
    });
  } catch (error) {
    console.warn(`Error fetching image from ${url}, skipping:`, error);
    return null;
  }
}

function toIsoMaybe(v: string): string {
  if (!v) return v;
  if (/^\d{4}-\d{2}-\d{2}T/.test(v)) return v;
  const d = dayjs(v);
  return d.isValid() ? d.toISOString() : v;
}

async function buildUpdateCourseFormData(
  courseData: UpdateCourseRequest,
): Promise<FormData> {
  const fd = new FormData();

  fd.append(
    "requestCourseInfo",
    new Blob(
      [
        JSON.stringify({
          ...courseData.requestCourseInfo,
          enrollmentStartDate: toIsoMaybe(
            courseData.requestCourseInfo.enrollmentStartDate,
          ),
          enrollmentEndDate: toIsoMaybe(
            courseData.requestCourseInfo.enrollmentEndDate,
          ),
        }),
      ],
      { type: "application/json" },
    ),
  );

  for (const [i, t] of courseData.thumbnailImages.entries()) {
    let file: File | null;
    if (typeof t === "string") {
      file = await urlToFile(t, `thumbnail_${i}.jpg`);
    } else {
      file = t;
    }
    if (file) {
      fd.append("thumbnailImages", file, file.name);
    }
  }

  if (courseData.courseCoverImage) {
    const coverFile =
      typeof courseData.courseCoverImage === "string"
        ? await urlToFile(courseData.courseCoverImage, "courseCover.jpg")
        : courseData.courseCoverImage;
    if (coverFile) {
      fd.append("courseCoverImage", coverFile, coverFile.name);
    }
  }

  return fd;
}

export const useUpdateCourse = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<UpdateCourseResponse | null>(null);

  const updateCourse = async (courseData: UpdateCourseRequest) => {
    setLoading(true);
    setError(null);
    setData(null);
    try {
      const formData = await buildUpdateCourseFormData(courseData);
      const response = await restClient.put<ApiResponse<UpdateCourseResponse>>(
        "/course/courses",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      setData(response.data.data);
      return response.data.data;
    } catch (err) {
      setError(getErrorMessage(err, "강좌 정보 수정에 실패했습니다."));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { updateCourse, loading, error, data };
};
