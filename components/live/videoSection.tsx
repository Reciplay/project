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

import { usePorcupine } from "@picovoice/porcupine-react";
import { useEffect } from "react";

interface VideoSectionProps {
  videoTrack: LocalVideoTrack | RemoteVideoTrack;
  audioTrack?: LocalAudioTrack | RemoteAudioTrack;
  participantIdentity: string;
  onNodesDetected?: (nodes: Landmark[][]) => void;
  setGesture?: (gesture: string) => void;
  onWakeWordDetected?: () => void;
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
  onWakeWordDetected,
  isAudioMuted,
  isVideoMuted,
}: VideoSectionProps) {
  const {
    keywordDetection,
    isLoaded,
    isListening,
    error,
    init,
    start,
    release,
  } = usePorcupine();

  useEffect(() => {
    if (keywordDetection !== null) {
      const detectedLabel =
        (keywordDetection as any)?.label ?? String(keywordDetection);
      console.log(
        `Wake word "${detectedLabel}" detected! Starting chatbot STT...`,
      );
      onWakeWordDetected?.();
    }
  }, [keywordDetection, onWakeWordDetected]);

  useEffect(() => {
    const initPorcupine = async () => {
      const accessKey =
        "I3NOG+N7ncUe6ibfyJZTWLyoHb/2oKwqGpy642LiMW4qyEjsY97bXw==";
      const keyword = {
        publicPath: "/porcupine/model.ppn",
        label: "하이 레시",
      };
      const model = {
        publicPath: "/porcupine/porcupine_params_ko.pv",
      };

      try {
        await init(accessKey, keyword, model);
        console.log("porcupine initiated...");
      } catch (err) {
        console.error("Failed to initialize Porcupine:", err);
      }
    };

    initPorcupine();

    return () => {
      release();
    };
  }, [init, release]);

  useEffect(() => {
    if (error) {
      console.error("Porcupine error:", error);
    }
  }, [error]);

  useEffect(() => {
    const startListening = async () => {
      if (isLoaded && !isListening) {
        try {
          await start();
        } catch (err) {
          console.error("Failed to start Porcupine:", err);
        }
      }
    };
    startListening();
  }, [isLoaded, isListening, start]);

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
