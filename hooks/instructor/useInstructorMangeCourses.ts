import restClient from "@/lib/axios/restClient";
import { ApiResponse } from "@/types/apiResponse";
import { CourseManage, CourseStatus } from "@/types/course";
import { useCallback, useEffect, useState } from "react";
export function useInstructorManageCourses(status: CourseStatus) {
  const [list, setList] = useState<CourseManage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchList = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await restClient.get<ApiResponse<CourseManage[]>>(
        "/course/courses/list",
        { params: { courseStatus: status }, requireAuth: true },
      );
      setList(res.data.data); // ✅ data 안에 배열
    } catch (e) {
      setError(
        e?.response?.data?.message ||
          e?.message ||
          "강좌 목록을 불러오지 못했습니다.",
      );
      setList([]);
    } finally {
      setLoading(false);
    }
  }, [status]);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  return { list, loading, error, refresh: fetchList };
}
