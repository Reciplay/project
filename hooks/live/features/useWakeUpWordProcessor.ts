import { LocalAudioTrack, RemoteAudioTrack } from "livekit-client";
import { useEffect, useRef } from "react";

export default function useWakeUpWordProcessor(
  audioTrack: LocalAudioTrack | RemoteAudioTrack | undefined,
  porcupineProcess: (pcm: Int16Array) => void,
) {
  const cleanupRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (audioTrack instanceof LocalAudioTrack) {
      const mediaStreamTrack = audioTrack.mediaStreamTrack;
      const ctx = new AudioContext();
      const src = ctx.createMediaStreamSource(
        new MediaStream([mediaStreamTrack]),
      );

      ctx.audioWorklet
        .addModule("/wake.js")
        .then(() => {
          const capture = new AudioWorkletNode(ctx, "wake-capture");
          src.connect(capture);

          capture.port.onmessage = ({ data }: MessageEvent<Int16Array>) => {
            porcupineProcess(data);
          };

          cleanupRef.current = () => {
            capture.disconnect();
            src.disconnect();
            ctx.close();
          };
        })
        .catch((error) => {
          console.error("Failed to add audio worklet module:", error);
        });
    }

    return () => {
      if (cleanupRef.current) {
        cleanupRef.current();
        cleanupRef.current = null;
      }
    };
  }, [audioTrack, porcupineProcess]);
}
