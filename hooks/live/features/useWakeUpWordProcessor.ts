import { LocalAudioTrack, RemoteAudioTrack } from "livekit-client";
import { useEffect, useRef } from "react";

// `await ctx.audioWorklet.addModule("/wake.js");`에 대한 수정:
// addModule이 실제로 비동기 작업이라면, setupWakeUpWordProcessor 함수는 async로 유지되고 Promise<() => void>를 반환해야 합니다. 이는 videoSection.tsx의
// useEffect를 복잡하게 만들 것입니다.

// 더 나은 접근 방식은 useWakeUpWordProcessor를 훅으로 유지하되, audioTrack이 null 또는 undefined인 경우를 내부적으로 처리하고, audioTrack이 LocalAudioTrack인
// 경우에만 오디오 처리 설정을 진행하도록 하는 것입니다.

// useWakeUpWordProcessor.ts를 수정하여 audioTrack ( LocalAudioTrack | RemoteAudioTrack | undefined가 될 수 있음)과 porcupineProcess를 받는 훅으로 만들고,
// 조건부로 오디오 처리를 설정하도록 하겠습니다.
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

          capture.port.onmessage = ({ data }: MessageEvent<Float32Array>) => {
            const floatAudioData = data;

            const sourceSampleRate = ctx.sampleRate;
            const targetSampleRate = 16000;
            const ratio = sourceSampleRate / targetSampleRate;
            const newLength = Math.floor(floatAudioData.length / ratio);
            const downsampled = new Float32Array(newLength);

            let inputIndex = 0;
            for (let i = 0; i < newLength; i++) {
              downsampled[i] = floatAudioData[Math.round(inputIndex)]!;
              inputIndex += ratio;
            }

            const pcm16 = new Int16Array(downsampled.length);
            for (let i = 0; i < downsampled.length; i++) {
              let s = Math.max(-1, Math.min(1, downsampled[i]!));
              s = s < 0 ? s * 0x8000 : s * 0x7fff;
              pcm16[i] = s;
            }
            porcupineProcess(pcm16);
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
