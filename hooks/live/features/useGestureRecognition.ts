"use client";

import { recognizeGesture } from "@/components/live/gestureRecognizer";
import { useCallback, useRef, useState } from "react";

export const useGestureRecognition = () => {
  const [handGesture, setHandGesture] = useState("");
  const lastHandGestureCheck = useRef(0);

  const handleHandGesture = useCallback((value: string) => {
    const now = Date.now();
    if (now - lastHandGestureCheck.current > 1000) {
      lastHandGestureCheck.current = now;
      setHandGesture((prev) => (prev === value ? prev : value));
      if (value && value !== "None") {
        console.log("Hand Gesture recognized:", value);
      }
    }
  }, []);

  const [recognizedPose, setPose] = useState("");
  const lastGestureCheck = useRef(0);

  const handleNodesDetected = useCallback((nodes: any) => {
    const now = Date.now();
    if (now - lastGestureCheck.current > 1000) {
      lastGestureCheck.current = now;
      if (nodes && nodes.length > 0) {
        const newGesture = recognizeGesture(nodes[0]);
        if (newGesture) {
          console.log("Gesture recognized:", newGesture);
          setPose(newGesture);
        }
      }
    }
  }, []);

  return {
    handGesture,
    recognizedPose,
    handleHandGesture,
    handleNodesDetected,
  };
};
