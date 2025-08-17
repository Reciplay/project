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
  setGesture?: (gesture: string) => void;
  todo?: string;
  isAudioMuted?: boolean;
  isVideoMuted?: boolean;
}

export default function VideoSection({
  videoTrack,
  audioTrack,
  participantIdentity,
  onNodesDetected,
  setGesture,
  isAudioMuted,
  isVideoMuted,
}: VideoSectionProps) {
  return (
    <div className={`${styles.video} ${styles.localVideo}`}>
      <StreamVideo
        track={videoTrack}
        participantIdentity={participantIdentity}
        onNodesDetected={onNodesDetected}
        setGesture={setGesture}
        isMuted={isVideoMuted}
      />

      {audioTrack instanceof RemoteAudioTrack && (
        <StreamAudio track={audioTrack} isMuted={isAudioMuted} />
      )}
    </div>
  );
}
