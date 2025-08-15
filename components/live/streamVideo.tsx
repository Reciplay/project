"use client";

import { useVideoUtil } from "@/hooks/live/useVideoUtil";
import { Landmark } from "@mediapipe/tasks-vision";
import { LocalVideoTrack, RemoteVideoTrack } from "livekit-client";
import { memo } from "react";
import styles from "./streamVideo.module.scss";

interface StreamVideoProps {
  track: LocalVideoTrack | RemoteVideoTrack;
  participantIdentity: string;
  onNodesDetected?: (nodes: Landmark[][]) => void;
  setGesture?: (gesture: string) => void;
}

const StreamVideo = memo(function StreamVideo({
  track,
  participantIdentity,
  onNodesDetected,
  setGesture,
}: StreamVideoProps) {
  const { videoRef, canvasRef } = useVideoUtil(
    track,
    onNodesDetected ?? (() => {}),
    setGesture,
  );

  return (
    <div id={participantIdentity} className={styles.videoContainer}>
      <video
        ref={videoRef}
        id={track.sid}
        className={styles.videoTag}
        autoPlay
        playsInline
        muted={track instanceof LocalVideoTrack}
      ></video>

      {track instanceof LocalVideoTrack && (
        <canvas ref={canvasRef} className={styles.invisibleCanvas} />
      )}
    </div>
  );
});

export default StreamVideo;
