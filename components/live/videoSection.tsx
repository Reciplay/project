import { Landmark } from "@mediapipe/tasks-vision";
import {
  LocalAudioTrack,
  LocalVideoTrack,
  RemoteAudioTrack,
  RemoteVideoTrack,
} from "livekit-client";
import StreamVideo from "./streamVideo";

import StreamAudio from "./streamAudio";
import styles from "./videoSection.module.scss";

interface VideoSectionProps {
  videoTrack: LocalVideoTrack | RemoteVideoTrack;
  audioTrack?: LocalAudioTrack | RemoteAudioTrack;
  participantIdentity: string;
  onNodesDetected?: (nodes: Landmark[][]) => void;
  todo?: string;
}

export default function VideoSection({
  videoTrack,
  audioTrack,
  participantIdentity,
  onNodesDetected,
  todo,
}: VideoSectionProps) {
  return (
    <div className={`${styles.video} ${styles.localVideo}`}>
      <StreamVideo
        track={videoTrack}
        participantIdentity={participantIdentity}
        onNodesDetected={onNodesDetected}
      />

      {/* 닉네임 오버레이 */}
      <div className={styles.nicknameOverlay}>
        <p>{participantIdentity}</p>
      </div>

      {/* ToDo 오버레이 */}
      <div className={styles.todoOverlay}>
        <h4>📋 할 일</h4>
        <div>{todo}</div>
      </div>
      {audioTrack instanceof RemoteAudioTrack && (
        <StreamAudio track={audioTrack} />
      )}
    </div>
  );
}
