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

const LIVEKIT_URL: string = "wss://i13e104.p.ssafy.io/live";

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
          _track: RemoteTrack,
          publication: RemoteTrackPublication,
          participant: RemoteParticipant,
        ) => {
          console.log(
            "✅ TrackSubscribed:",
            publication.trackName,
            publication.trackSid,
          );

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
        (_track: RemoteTrack, publication: RemoteTrackPublication) => {
          setRemoteTracks((prev) =>
            prev.filter(
              (track) =>
                track.trackPublication.trackSid !== publication.trackSid,
            ),
          );
        },
      );

      try {
        const permission = await getLocalMedia();
        if (!permission) throw new Error("Media access denied");

        const { token, nickname } = await getToken(courseId, lectureId, role);

        await newRoom.connect(LIVEKIT_URL, token);
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
