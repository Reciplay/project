"use client";

import { LocalAudioTrack, RemoteAudioTrack } from "livekit-client";
import { useEffect, useRef } from "react";

interface StreamAudioProps {
  track: LocalAudioTrack | RemoteAudioTrack;
  isMuted?: boolean; // Added isMuted prop
}

export default function StreamAudio({ track, isMuted }: StreamAudioProps) {
  const audioElement = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioElement.current && !isMuted) {
      // Only attach if not muted
      track.attach(audioElement.current);
    }

    return () => {
      track.detach();
    };
  }, [track, isMuted]); // Add isMuted to dependency array

  return isMuted ? null : <audio ref={audioElement} id={track.sid} />;
}
