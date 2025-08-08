import {
  PoseLandmarker,
  FilesetResolver,
  Landmark,
} from "@mediapipe/tasks-vision";

let poseLandmarker: PoseLandmarker;
export const createPoseLandmarker = async () => {
  const vision = await FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.9/wasm"
  );

  poseLandmarker = await PoseLandmarker.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath:
        "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task",
      delegate: "GPU",
    },
    runningMode: "VIDEO",
    numPoses: 2,
  });
};

export default async function poseRecognition(
  video: HTMLVideoElement,
  canvas: HTMLCanvasElement,
  setLandmarksData: (landmarks: Landmark[][]) => void,
  onNodesDetected: (nodes: Landmark[][]) => void
): Promise<() => void> {
  const canvasCtx = canvas.getContext("2d");
  if (!canvasCtx) {
    return () => {};
  }

  let lastVideoTime = -1;
  let animationFrameId: number;

  const renderLoop = () => {
    if (
      video.videoWidth > 0 &&
      video.videoHeight > 0 &&
      video.currentTime !== lastVideoTime
    ) {
      const timeStamp = performance.now();
      const poseLandmarkerResult = poseLandmarker.detectForVideo(
        video,
        timeStamp
      );

      canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
      if (poseLandmarkerResult.landmarks) {
        setLandmarksData(poseLandmarkerResult.landmarks);
        onNodesDetected(poseLandmarkerResult.landmarks);
      }
      lastVideoTime = video.currentTime;
    }
    animationFrameId = requestAnimationFrame(renderLoop);
  };
  renderLoop();

  return () => {
    cancelAnimationFrame(animationFrameId);
  };
}
