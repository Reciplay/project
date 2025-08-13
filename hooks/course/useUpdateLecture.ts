import { getErrorMessage } from "@/lib/axios/error";
import restClient from "@/lib/axios/restClient";
import { ApiResponse } from "@/types/apiResponse";
import { UpdateLectureRequest, UpdateLectureResponse } from "@/types/lecture";
import { useState } from "react";

export const useUpdateLecture = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<UpdateLectureResponse | null>(null);

  const updateLecture = async (
    courseId: number,
    lectureData: UpdateLectureRequest,
  ) => {
    setLoading(true);
    setError(null);
    setData(null);
    try {
      const response = await restClient.put<ApiResponse<UpdateLectureResponse>>(
        `/course/lecture`,
        lectureData,
        {
          params: { courseId },
        },
      );
      setData(response.data.data);
      return response.data.data;
    } catch (e) {
      setError(getErrorMessage(e, "강의 정보 수정에 실패했습니다."));
    } finally {
      setLoading(false);
    }
  };

  return { updateLecture, loading, error, data };
};
