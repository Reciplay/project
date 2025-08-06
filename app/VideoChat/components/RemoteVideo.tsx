"use client";

import { RemoteTrackPublication } from "livekit-client";
import VideoComponent from "./VideoComponent";
import styles from "../page.module.css";

interface RemoteVideoProps {
  trackPublication: RemoteTrackPublication;
  participantIdentity: string;
  onNodesDetected: (nodes: any) => void;
}

const RemoteVideo = ({ trackPublication, participantIdentity, onNodesDetected }: RemoteVideoProps) => {
  if (!trackPublication.videoTrack) {
    return null;
  }

  return (
    <div className={`${styles.video} ${styles.remoteVideo}`}>
      <VideoComponent
        track={trackPublication.videoTrack}
        participantIdentity={participantIdentity}
        onNodesDetected={onNodesDetected}
      />
    </div>
  );
};

export default RemoteVideo;
