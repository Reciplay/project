"use client";

import restClient, { extractAxiosErrorMessage } from "@/lib/axios/restClient";
import { useState } from "react";

export function useReviewLike() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const likeReview = async (reviewId: number) => {
    setLoading(true);
    setError(null);
    try {
      await restClient.post(
        `/user/review/like`,
        {},
        {
          params: { reviewId },
          requireAuth: true,
        },
      );
      return true;
    } catch (err) {
      const errorMessage = extractAxiosErrorMessage(
        err,
        "좋아요 처리에 실패했습니다.",
      );
      setError(errorMessage);
      console.error("Error liking review:", err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const unlikeReview = async (reviewId: number) => {
    setLoading(true);
    setError(null);
    try {
      await restClient.delete(`/user/review/like`, {
        params: { reviewId },
        requireAuth: true,
      });
      return true;
    } catch (err) {
      const errorMessage = extractAxiosErrorMessage(
        err,
        "좋아요 취소에 실패했습니다.",
      );
      setError(errorMessage);
      console.error("Error unliking review:", err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { likeReview, unlikeReview, loading, error };
}
