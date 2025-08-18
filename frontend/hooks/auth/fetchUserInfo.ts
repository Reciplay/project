import restClient from "@/lib/axios/restClient";
import { useUserStore } from "@/stores/userStore";
import { ApiResponse } from "@/types/apiResponse";
import { User } from "@/types/user";
import { getSession } from "next-auth/react";

export const fetchUserInfo = async () => {
  const store = useUserStore.getState();

  // 이미 상태가 결정되었으면 요청 생략
  if (store.isExtraFilled !== null) return;

  const session = await getSession();
  if (!session?.accessToken) return;

  try {
    const { data } = await restClient.get<ApiResponse<User>>("/user/profile", {
      requireAuth: true,
    });
    const { name, job, birthDate, gender } = data.data;

    const isFilled = Boolean(name && job && birthDate) && gender !== null;

    store.setIsExtraFilled(isFilled);
  } catch (error) {
    console.error("❌ 회원 정보 조회 실패:", error);
  }
};
