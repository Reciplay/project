"use client";

import { LocalVideoTrack } from "livekit-client";
import VideoComponent from "./VideoComponent";
import styles from "../page.module.css";

interface LocalVideoProps {
  track: LocalVideoTrack;
  participantIdentity: string;
  onNodesDetected: (nodes: any) => void;
}

const LocalVideo = ({ track, participantIdentity, onNodesDetected }: LocalVideoProps) => {
  return (
    <div className={`${styles.video} ${styles.localVideo}`}>
      <VideoComponent
        track={track}
        participantIdentity={participantIdentity + " (You)"}
        onNodesDetected={onNodesDetected}
      />
    </div>
  );
};

export default LocalVideo;
