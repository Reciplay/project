import restClient from "@/lib/axios/restClient";
import {
  LocalAudioTrack,
  LocalVideoTrack,
  RemoteParticipant,
  RemoteTrack,
  RemoteTrackPublication,
  Room,
  RoomEvent,
} from "livekit-client";
import { useCallback, useRef, useState } from "react";
import useLocalMedia from "./useLocalMedia";

const LIVEKIT_URL: string = "";

export type TrackInfo = {
  trackPublication: RemoteTrackPublication;
  participantIdentity: string;
};

export default function useLivekitConnection() {
  const { getLocalMedia } = useLocalMedia();
  const roomRef = useRef<Room>(undefined);
  const [room, setRoom] = useState<Room | undefined>(undefined);
  const [localTrack, setLocalTrack] = useState<LocalVideoTrack | undefined>(
    undefined,
  );
  const [localAudioTrack, setLocalAudioTrack] = useState<
    LocalAudioTrack | undefined
  >(undefined);

  const [remoteTracks, setRemoteTracks] = useState<TrackInfo[]>([]);
  const [nickname, setNickname] = useState<string | null>(null);

  const getToken = useCallback(
    async (courseId: string, lectureId: string, role: string) => {
      const type = role == "ROLE_STUDENT" ? "student" : "instructor";

      const res = await restClient.post(
        `/livekit/${type}/token`,
        { lectureId: lectureId, courseId: courseId },
        { requireAuth: true },
      );
      if (res.data.status !== "success") {
        const error = res.data.message;
        throw new Error(`Failed to get token: ${error}`);
      }
      const data = res.data.data;
      console.log(`token:${res.data.data.token}`); // Log only the token
      return data; // Return the entire data object
    },
    [],
  );

  const joinRoom = useCallback(
    async (courseId: string, lectureId: string, role: string) => {
      const newRoom = new Room();
      roomRef.current = newRoom;
      setRoom(newRoom);

      console.log("조인룸");

      newRoom.on(RoomEvent.ParticipantConnected, (participant) => {
        console.log("🎉 상대방 입장:", participant);
      });

      newRoom.on(
        RoomEvent.TrackSubscribed,
        (
          track: RemoteTrack,
          publication: RemoteTrackPublication,
          participant: RemoteParticipant,
        ) => {
          console.log(
            "✅ TrackSubscribed:",
            publication.trackName,
            publication.trackSid,
          );

          // 오디오 트랙이면 곧바로 attach
          if (track.kind === "audio") {
            const el = track.attach() as HTMLAudioElement; // <audio> 생성/반환
            el.autoplay = true;
            // el.playsInline = true;
            el.muted = false;
            document.body.appendChild(el);
          }

          setRemoteTracks((prev) => [
            ...prev,
            {
              trackPublication: publication,
              participantIdentity: participant.identity,
            },
          ]);
        },
      );

      newRoom.on(
        RoomEvent.TrackUnsubscribed,
        (track: RemoteTrack, publication: RemoteTrackPublication) => {
          // detach 시에는 엘리먼트도 제거
          track.detach().forEach((el) => el.remove());
          setRemoteTracks((prev) =>
            prev.filter(
              (t) => t.trackPublication.trackSid !== publication.trackSid,
            ),
          );
        },
      );

      try {
        const permission = await getLocalMedia();
        if (!permission) throw new Error("Media access denied");

        const { token, nickname } = await getToken(courseId, lectureId, role);

        await newRoom.connect(LIVEKIT_URL, token);

        // 사용자 제스처 안의 흐름에서 실행되도록 보장
        try {
          await newRoom.startAudio();
        } catch {
          console.warn(
            'Autoplay blocked, show " 오디오 시작" 버튼을 눌러주세요',
          );
        }

        setNickname(nickname); // Set the nickname state
        await newRoom.localParticipant.enableCameraAndMicrophone();
        setLocalTrack(
          newRoom.localParticipant.videoTrackPublications.values().next().value
            ?.videoTrack,
        );
        setLocalAudioTrack(
          newRoom.localParticipant.audioTrackPublications.values().next().value
            ?.audioTrack,
        );
      } catch (error) {
        console.log(
          "There was an error connecting to the room:",
          (error as Error).message,
        );
        await newRoom.disconnect();
      }
    },
    [getLocalMedia, getToken],
  );

  const leaveRoom = useCallback(async () => {
    console.log("Leaving room...");
    await roomRef.current?.disconnect();
    setRoom(undefined);
    setLocalTrack(undefined);
    setLocalAudioTrack(undefined);
    setRemoteTracks([]);
  }, []);

  return {
    room,
    localTrack,
    localAudioTrack,
    remoteTracks,
    joinRoom,
    leaveRoom,
    nickname,
  };
}
