"use client";

import { LocalAudioTrack, RemoteAudioTrack } from "livekit-client";
import { useEffect, useRef } from "react";

interface StreamAudioProps {
  track: LocalAudioTrack | RemoteAudioTrack;
}

export default function StreamAudio({ track }: StreamAudioProps) {
  const audioElement = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioElement.current) {
      track.attach(audioElement.current);
    }

    return () => {
      track.detach();
    };
  }, [track]);

  return <audio ref={audioElement} id={track.sid} />;
}
