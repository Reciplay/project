"use client";

import { useCallback, useState } from "react";

export default function useLocalMedia() {
  const [error, setError] = useState<string | null>(null);

  const getLocalMedia = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      return stream;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to access media devices";
      console.error("[useLocalMedia]", message);
      setError(message);
      return null;
    }
  }, []);

  return {
    getLocalMedia,
    error,
  };
}
