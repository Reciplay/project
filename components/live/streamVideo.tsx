"use client";

import { LocalVideoTrack, RemoteVideoTrack } from "livekit-client";
import { memo, useEffect, useRef, useState } from "react";
import { Landmark } from "@mediapipe/tasks-vision";
import styles from "./streamVideo.module.scss";
import poseRecognition, {
  createPoseLandmarker,
} from "@/lib/video/recognizeGesture";
import { useVideoUtil } from "@/hooks/live/useVideoUtil";

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
  const { videoRef, canvasRef, landmarksData } = useVideoUtil(
    track,
    onNodesDetected
  );

  return (
    <div id={participantIdentity} className={styles.videoContainer}>
      <video
        ref={videoRef}
        id={track.sid}
        className={styles.videoTag}
        // ref={videoRef}
        // id={track.sid}
        // className={styles.videoTag}
        // autoPlay
        // playsInline
        // muted={track instanceof LocalVideoTrack}
      ></video>

      {track instanceof LocalVideoTrack && (
        <canvas ref={canvasRef} className={styles.invisibleCanvas} />
      )}
    </div>
  );
});

export default StreamVideo;
