"use client";

import restClient from "@/lib/axios/restClient";
import { ApiResponse } from "@/types/apiResponse";
import { useEffect, useState } from "react";

export interface SubscribedInstructor {
  instructorProfileFileInfo: {
    presignedUrl: string;
    name: string;
    sequence: number;
  };
  instructorName: string;
  instructorId: number;
  subscriberCount: number;
}

export const useSubscribedInstructors = () => {
  const [instructors, setInstructors] = useState<SubscribedInstructor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInstructors = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await restClient.get<
          ApiResponse<SubscribedInstructor[]>
        >("/user/subscription/list", {
          requireAuth: true,
          useCors: false,
        });
        if (response.data.status === "success") {
          setInstructors(response.data.data);
        } else {
          setError(response.data.message || "Failed to fetch instructors.");
        }
      } catch (err) {
        console.error("Error fetching subscribed instructors:", err);
        setError("An error occurred while fetching instructors.");
      } finally {
        setLoading(false);
      }
    };

    fetchInstructors();
  }, []);

  return { instructors, loading, error };
};
