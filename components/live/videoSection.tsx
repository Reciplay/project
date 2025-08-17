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
import { useEffect, useState } from "react";

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
  isChatbotOpen?: boolean;
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
  isChatbotOpen,
}: VideoSectionProps) {
  const [isKeywordListening, setIsKeywordListening] = useState(true);
  const {
    keywordDetection,
    isLoaded,
    isListening,
    error,
    init,
    start,
    stop,
    release,
  } = usePorcupine();

  useEffect(() => {
    if (keywordDetection !== null && isKeywordListening) {
      const detectedLabel =
        (keywordDetection as any)?.label ?? String(keywordDetection);
      console.log(
        `Wake word "${detectedLabel}" detected! Starting chatbot STT...`,
      );
      onWakeWordDetected?.();
      setIsKeywordListening(false);
    }
  }, [keywordDetection, onWakeWordDetected, isKeywordListening]);

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
    if (isChatbotOpen === false && !isKeywordListening) {
      console.log("Re-enabling keyword detection as chatbot is closed.");
      setIsKeywordListening(true);
    }
  }, [isChatbotOpen, isKeywordListening]);

  useEffect(() => {
    const controlListening = async () => {
      if (isLoaded) {
        if (isKeywordListening && !isListening) {
          try {
            await start();
          } catch (err) {
            console.error("Failed to start Porcupine:", err);
          }
        } else if (!isKeywordListening && isListening) {
          try {
            await stop();
          } catch (err) {
            console.error("Failed to stop Porcupine:", err);
          }
        }
      }
    };
    controlListening();
  }, [isLoaded, isListening, start, stop, isKeywordListening]);

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
