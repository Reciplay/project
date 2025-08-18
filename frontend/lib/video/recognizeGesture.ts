import {
  FilesetResolver,
  GestureRecognizer,
  Landmark,
  PoseLandmarker,
} from "@mediapipe/tasks-vision";

let poseLandmarker: PoseLandmarker;
let gestureRecognizer: GestureRecognizer;

export const createRecognizers = async () => {
  const vision = await FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.9/wasm",
  );
  gestureRecognizer = await GestureRecognizer.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath:
        "https://storage.googleapis.com/mediapipe-models/gesture_recognizer/gesture_recognizer/float16/1/gesture_recognizer.task",
      delegate: "GPU",
    },
    runningMode: "VIDEO",
    numHands: 2,
  });

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
  onNodesDetected: (nodes: Landmark[][]) => void,
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
      const gestureRecognizerResult = gestureRecognizer.recognizeForVideo(
        video,
        timeStamp,
      );
      const poseLandmarkerResult = poseLandmarker.detectForVideo(
        video,
        timeStamp,
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
// import {
//   FilesetResolver,
//   GestureRecognizer,
//   GestureRecognizerResult,
//   Landmark,
//   PoseLandmarker,
//   PoseLandmarkerResult,
// } from "@mediapipe/tasks-vision";

// let poseLandmarker: PoseLandmarker | undefined;
// let gestureRecognizer: GestureRecognizer | undefined;

// export const createRecognizers = async () => {
//   const vision = await FilesetResolver.forVisionTasks(
//     "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.9/wasm",
//   );

//   gestureRecognizer = await GestureRecognizer.createFromOptions(vision, {
//     baseOptions: {
//       modelAssetPath:
//         "https://storage.googleapis.com/mediapipe-models/gesture_recognizer/gesture_recognizer/float16/1/gesture_recognizer.task",
//       delegate: "GPU",
//     },
//     runningMode: "LIVE_STREAM", // ⭐ 직접 문자열로 값을 입력
//     numHands: 2,
//   });

//   poseLandmarker = await PoseLandmarker.createFromOptions(vision, {
//     baseOptions: {
//       modelAssetPath:
//         "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task",
//       delegate: "GPU",
//     },
//     runningMode: "LIVE_STREAM", // ⭐ 직접 문자열로 값을 입력
//     numPoses: 2,
//   });
// };

// export default async function poseGestureRecognition(
//   video: HTMLVideoElement,
//   canvas: HTMLCanvasElement,
//   setLandmarksData: (landmarks: Landmark[][]) => void,
//   setHandGesture: (handGesture: string) => void,
//   onNodesDetected: (nodes: Landmark[][]) => void,
// ): Promise<() => void> {
//   const canvasCtx = canvas.getContext("2d");
//   if (!canvasCtx) {
//     return () => {};
//   }

//   let lastVideoTime = -1;
//   let animationFrameId: number;

//   const renderLoop = () => {
//     canvas.width = video.videoWidth;
//     canvas.height = video.videoHeight;

//     if (!poseLandmarker || !gestureRecognizer) {
//       animationFrameId = requestAnimationFrame(renderLoop);
//       return;
//     }

//     if (video.currentTime !== lastVideoTime) {
//       const timeStamp = performance.now();

//       const poseCallback = (poseLandmarkerResult: PoseLandmarkerResult) => {
//         if (poseLandmarkerResult.landmarks) {
//           setLandmarksData(poseLandmarkerResult.landmarks);
//           onNodesDetected(poseLandmarkerResult.landmarks);
//         }
//       };

//       const gestureCallback = (
//         gestureRecognizerResult: GestureRecognizerResult,
//       ) => {
//         if (gestureRecognizerResult.gestures) {
//           gestureRecognizerResult.gestures.forEach((candidates) => {
//             const top = candidates[0];
//             if (top && top.score > 0.7) {
//               setHandGesture(top.categoryName);
//             }
//           });
//         }
//       };

//       poseLandmarker.detectForVideo(video, timeStamp, poseCallback);
//       gestureRecognizer.recognizeForVideo(video, timeStamp, gestureCallback);

//       lastVideoTime = video.currentTime;
//     }

//     canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
//     canvasCtx.drawImage(video, 0, 0, canvas.width, canvas.height);

//     animationFrameId = requestAnimationFrame(renderLoop);
//   };

//   renderLoop();

//   return () => {
//     cancelAnimationFrame(animationFrameId);
//   };
// }
