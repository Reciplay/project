import {
  LocalAudioTrack,
  LocalVideoTrack,
  RemoteAudioTrack,
  RemoteVideoTrack,
} from "livekit-client";
import StreamVideo from "./streamVideo";
import { Landmark } from "@mediapipe/tasks-vision";

import styles from "./videoSection.module.scss";
import StreamAudio from "./streamAudio";

interface VideoSectionProps {
  videoTrack: LocalVideoTrack | RemoteVideoTrack;
  audioTrack?: LocalAudioTrack | RemoteAudioTrack;
  participantIdentity: string;
  onNodesDetected?: (nodes: Landmark[][]) => void;
  setGesture?: (gesture: string) => void;
  todo?: string;
}

export default function VideoSection({
  videoTrack,
  audioTrack,
  participantIdentity,
  onNodesDetected,
  setGesture,
}: VideoSectionProps) {
  return (
    <div className={`${styles.video} ${styles.localVideo}`}>
      <StreamVideo
        track={videoTrack}
        participantIdentity={participantIdentity}
        onNodesDetected={onNodesDetected}
        setGesture={setGesture}
      />

      {/* 닉네임 오버레이 */}
      <div className={styles.nicknameOverlay}>
        <p>{participantIdentity}</p>
      </div>

      {audioTrack instanceof RemoteAudioTrack && (
        <StreamAudio track={audioTrack} />
      )}
    </div>
  );
}
