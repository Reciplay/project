import { useEffect, useRef, useState } from "react";
import { RemoteVideoTrack, Track, LocalVideoTrack } from "livekit-client";
import { Landmark } from "@mediapipe/tasks-vision";
import poseGestureRecognition, {
  createRecognizers,
} from "@/lib/video/recognizeGesture";

export function useVideoUtil(
  track: Track,
  onNodesDetected: (nodes: Landmark[][]) => void,
  setGesture?: (gesture: string) => void
) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [landmarksData, setLandmarksData] = useState<Landmark[][]>([]);

  // ✅ 1. 비디오 트랙 attach/detach 전용 useEffect
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    track.attach(video);
    return () => {
      track.detach();
    };
  }, [track]);

  // ✅ 2. 포즈 인식 전용 useEffect (local일 때만 실행)
  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas || !setGesture) return;
    if (track instanceof RemoteVideoTrack) return;

    let cleanup: (() => void) | undefined;

    const handleMetadataLoaded = () => {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      createRecognizers().then(() => {
        poseGestureRecognition(
          video,
          canvas,
          setLandmarksData,
          setGesture,
          onNodesDetected
        ).then((returnedCleanup) => {
          cleanup = returnedCleanup;
        });
      });
    };

    video.addEventListener("loadedmetadata", handleMetadataLoaded);

    return () => {
      video.removeEventListener("loadedmetadata", handleMetadataLoaded);
      if (cleanup) cleanup();
    };
  }, [track, onNodesDetected, setGesture]);

  return { videoRef, canvasRef, landmarksData };
}
