import restClient from "@/lib/axios/restClient";
import { ApiResponse } from "@/types/apiResponse";
import { useState } from "react";

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
  thumbnailImages: string[];
  courseCoverImage: string;
}

interface UpdateCourseResponse {
  courseId: number;
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
      const response = await restClient.put<ApiResponse<UpdateCourseResponse>>(
        "/course/courses",
        courseData,
      );
      setData(response.data.data); // Changed to access the 'data' property of ApiResponse
      return response.data.data; // Changed return value
    } catch (err) {
      setError(err.message || "강좌 정보 수정에 실패했습니다.");
      throw err; // Re-throw to allow caller to handle
    } finally {
      setLoading(false);
    }
  };

  return { updateCourse, loading, error, data };
};
