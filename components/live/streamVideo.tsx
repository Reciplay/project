"use client";

import { LocalVideoTrack, RemoteVideoTrack } from "livekit-client";
import { memo, useEffect, useRef, useState } from "react";
import {
  PoseLandmarker,
  FilesetResolver,
  Landmark,
} from "@mediapipe/tasks-vision";
import styles from "./streamVideo.module.scss";

let poseLandmarker: PoseLandmarker;
const createPoseLandmarker = async () => {
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

async function poseRecognition(
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

interface StreamVideoProps {
  track: LocalVideoTrack | RemoteVideoTrack;
  participantIdentity: string;
  onNodesDetected?: (nodes: Landmark[][]) => void;
}

const StreamVideo = memo(function StreamVideo({
  track,
  participantIdentity,
  onNodesDetected,
}: StreamVideoProps) {
  const videoElement = useRef<HTMLVideoElement | null>(null);
  const canvasElement = useRef<HTMLCanvasElement | null>(null);
  const [landmarksData, setLandmarksData] = useState<Landmark[][]>([]);

  //   useEffect(() => {
  //     let cleanup: (() => void) | undefined;
  //     const video = videoElement.current;
  //     const canvas = canvasElement.current;

  //     if (video && canvas) {
  //       track.attach(video);

  //       const handleMetadataLoaded = () => {
  //         canvas.width = video.videoWidth;
  //         canvas.height = video.videoHeight;
  //         createPoseLandmarker().then(() => {
  //           poseRecognition(
  //             video,
  //             canvas,
  //             setLandmarksData,
  //             onNodesDetected
  //           ).then((returnedCleanup) => {
  //             cleanup = returnedCleanup;
  //           });
  //         });
  //       };

  //       video.addEventListener("loadedmetadata", handleMetadataLoaded);

  //       // Cleanup function
  //       return () => {
  //         video.removeEventListener("loadedmetadata", handleMetadataLoaded);
  //         track.detach();
  //         if (cleanup) {
  //           cleanup();
  //         }
  //       };
  //     }

  //     return () => {
  //       track.detach();
  //       if (cleanup) {
  //         cleanup();
  //       }
  //     };
  //   }, [track, onNodesDetected]);

  useEffect(() => {
    const video = videoElement.current;
    const canvas = canvasElement.current;

    if (!video) return;

    track.attach(video);

    // remote라면 pose 생략
    if (!(track instanceof LocalVideoTrack)) {
      return () => {
        track.detach();
      };
    }

    if (!canvas) return;

    let cleanup: (() => void) | undefined;

    const handleMetadataLoaded = () => {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      createPoseLandmarker().then(() => {
        poseRecognition(video, canvas, setLandmarksData, onNodesDetected).then(
          (returnedCleanup) => {
            cleanup = returnedCleanup;
          }
        );
      });
    };

    video.addEventListener("loadedmetadata", handleMetadataLoaded);

    return () => {
      video.removeEventListener("loadedmetadata", handleMetadataLoaded);
      track.detach();
      if (cleanup) cleanup();
    };
  }, [track, onNodesDetected]);

  return (
    <div id={participantIdentity} className={styles.videoContainer}>
      <video
        // ref={videoElement}
        // id={track.sid}
        // className={styles.videoTag}
        ref={videoElement}
        id={track.sid}
        className={styles.videoTag}
        autoPlay
        playsInline
        muted={track instanceof LocalVideoTrack}
      ></video>

      {track instanceof LocalVideoTrack && (
        <canvas
          ref={canvasElement}
          className={styles.invisibleCanvas} // 화면엔 보이지 않게
        />
      )}
    </div>
  );
});

export default StreamVideo;
