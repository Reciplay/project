import {
  PoseLandmarker,
  FilesetResolver,
  Landmark,
  GestureRecognizer,
} from "@mediapipe/tasks-vision";

let poseLandmarker: PoseLandmarker;
let gestureRecognizer: GestureRecognizer;

export const createRecognizers = async () => {
  const vision = await FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.9/wasm"
  );
  gestureRecognizer = await GestureRecognizer.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath:
        "https://storage.googleapis.com/mediapipe-models/gesture_recognizer/gesture_recognizer/float16/1/gesture_recognizer.task",
      delegate: "CPU",
    },
    runningMode: "VIDEO",
    numHands: 2
  })

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

export default async function poseGestureRecognition(
  video: HTMLVideoElement,
  canvas: HTMLCanvasElement,
  setLandmarksData: (landmarks: Landmark[][]) => void,
  setHandGesture: (handGesture: string) => void,
  onNodesDetected: (nodes: Landmark[][]) => void
): Promise<() => void> {
  const canvasCtx = canvas.getContext("2d");
  if (!canvasCtx) {
    return () => { };
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
      const gestureRecognizerResult = gestureRecognizer.recognizeForVideo(
        video,
        timeStamp
      );
      const poseLandmarkerResult = poseLandmarker.detectForVideo(
        video,
        timeStamp
      );

      canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
      gestureRecognizerResult.gestures.forEach((candidates) => {
        const top = candidates[0];
        if (top && top.score > 0.7) {
          setHandGesture(top.categoryName);
        }
      });

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
