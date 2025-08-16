"use client";

import { useVideoUtil } from "@/hooks/live/useVideoUtil";
import { Landmark } from "@mediapipe/tasks-vision";
import { LocalVideoTrack, RemoteVideoTrack } from "livekit-client";
import { memo, useEffect } from "react";
import styles from "./streamVideo.module.scss";

interface StreamVideoProps {
  track: LocalVideoTrack | RemoteVideoTrack;
  participantIdentity: string;
  onNodesDetected?: (nodes: Landmark[][]) => void;
  setGesture?: (gesture: string) => void;
  isMuted?: boolean; // Added isMuted prop
}

const StreamVideo = memo(function StreamVideo({
  track,
  participantIdentity,
  onNodesDetected,
  setGesture,
  isMuted,
}: StreamVideoProps) {
  const { videoRef, canvasRef } = useVideoUtil(
    track,
    onNodesDetected ?? (() => {}),
    setGesture,
  );

  // Debugging play() call and LiveKit track state
  useEffect(() => {
    console.log(
      `[StreamVideo DEBUG] ${participantIdentity} - isMuted prop:`,
      isMuted,
    );
    console.log(
      `[StreamVideo DEBUG] ${participantIdentity} - LiveKit track.isMuted:`,
      track.isMuted,
    );

    if (videoRef.current && !isMuted) {
      videoRef.current
        .play()
        .then(() =>
          console.log(
            `[StreamVideo DEBUG] ${participantIdentity} - Video play successful.`,
          ),
        )
        .catch((e) =>
          console.error(
            `[StreamVideo DEBUG] ${participantIdentity} - Error playing video:`,
            e,
          ),
        );
    }
  }, [isMuted, videoRef, participantIdentity, track]); // Added track to dependencies

  return (
    <div id={participantIdentity} className={styles.videoContainer}>
      <video
        ref={videoRef}
        id={track.sid}
        className={`${styles.videoTag} ${isMuted ? styles.hidden : ""}`} // Conditionally hide video
        autoPlay
        playsInline
        muted={track instanceof LocalVideoTrack}
      ></video>

      {isMuted && ( // Show placeholder if muted
        <div className={styles.placeholder}>
          <p>비디오가 꺼져 있습니다.</p>
        </div>
      )}

      {track instanceof LocalVideoTrack && (
        <canvas ref={canvasRef} className={styles.invisibleCanvas} />
      )}
    </div>
  );
});

export default StreamVideo;
