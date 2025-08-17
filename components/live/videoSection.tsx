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

import useWakeUpWordProcessor from "@/hooks/live/features/useWakeUpWordProcessor";
import {
  Porcupine,
  PorcupineKeyword,
  PorcupineModel,
} from "@picovoice/porcupine-web";
import { useCallback, useEffect, useState } from "react";

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
  const [porcupineHandle, setPorcupineHandle] = useState<Porcupine | null>(
    null,
  );

  // porcupine이 단어를 감지하면 실행되는 콜백
  const handleWakeWordDetected = useCallback(
    (detection: { label: string }) => {
      console.log(
        `Wake word "${detection.label}" detected! Starting chatbot STT...`,
      );
      onWakeWordDetected?.();
    },
    [onWakeWordDetected],
  );

  // porcupine 초기화 로직
  useEffect(() => {
    const initPorcupine = async () => {
      const accessKey = process.env.PICOVOICE_SECRET!;
      const keyword: PorcupineKeyword = {
        publicPath: "../",
        label: "하이 레시플레이",
      };
      const model: PorcupineModel = {
        publicPath: "/models/porcupine_params_ko.pv",
      };

      try {
        const handle = await Porcupine.create(
          accessKey,
          keyword,
          handleWakeWordDetected,
          model,
        );
        setPorcupineHandle(handle);
      } catch (error) {
        // console.error("Failed to initialize Porcupine:", error);
      }
    };

    initPorcupine();

    return () => {
      porcupineHandle?.release();
    };
  }, []);

  // Porcupine이 처리할 수 있는 형태로 오디오 트랙을 가공하는(리샘플링/다운사이징 등) 로직
  const porcupineProcess = useCallback(
    async (pcm: Int16Array) => {
      if (!porcupineHandle) return;
      try {
        await porcupineHandle.process(pcm);
      } catch (error) {
        console.error("Error processing audio with Porcupine:", error);
      }
    },
    [porcupineHandle],
  );

  // Call useWakeUpWordProcessor unconditionally at the top level
  // It will only start processing if audioTrack and porcupineProcess are valid
  useWakeUpWordProcessor(audioTrack, porcupineProcess);

  return (
    <div className={`${styles.video} ${styles.localVideo}`}>
      <StreamVideo
        track={videoTrack}
        participantIdentity={participantIdentity}
        onNodesDetected={onNodesDetected}
        setGesture={setGesture}
        isMuted={isVideoMuted} // Pass isVideoMuted to StreamVideo
      />

      {audioTrack instanceof RemoteAudioTrack && (
        <StreamAudio track={audioTrack} isMuted={isAudioMuted} /> // Pass isAudioMuted to StreamAudio
      )}
    </div>
  );
}
