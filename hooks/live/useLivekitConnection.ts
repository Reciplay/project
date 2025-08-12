import { useCallback, useState } from "react";
import {
  Room,
  RoomEvent,
  RemoteTrack,
  RemoteTrackPublication,
  RemoteParticipant,
  LocalVideoTrack,
} from "livekit-client";
import restClient from "@/lib/axios/restClient";
import useLocalMedia from "./useLocalMedia";

const LIVEKIT_URL: string = "ws://i13e104.p.ssafy.io:7880/";

export type TrackInfo = {
  trackPublication: RemoteTrackPublication;
  participantIdentity: string;
};

export default function useLivekitConnection() {
  const { getLocalMedia, error } = useLocalMedia();
  const [room, setRoom] = useState<Room | undefined>(undefined);

  // 로컬은 비디오만 처리 하면 되니까 LocalVideoTrack만 사용
  const [localTrack, setLocalTrack] = useState<LocalVideoTrack | undefined>(
    undefined
  );

  // 원격 트랙은 비디오와 오디오 모두 처리해야 하므로 TrackInfo 타입 사용
  const [remoteTracks, setRemoteTracks] = useState<TrackInfo[]>([]);

  const joinRoom = async (
    courseId: string,
    lectureId: string,
    role: string
  ) => {
    const newRoom = new Room();
    setRoom(newRoom);

    console.log("조인룸");

    newRoom.on(RoomEvent.ParticipantConnected, (participant) => {
      console.log("🎉 상대방 입장:", participant.identity);
    });

    // 구독 이벤트
    newRoom.on(
      RoomEvent.TrackSubscribed,
      (
        _track: RemoteTrack,
        publication: RemoteTrackPublication,
        participant: RemoteParticipant
      ) => {
        console.log(
          "✅ TrackSubscribed:",
          publication.trackName,
          publication.trackSid
        );

        setRemoteTracks((prev) => [
          ...prev,
          {
            trackPublication: publication,
            participantIdentity: participant.identity,
          },
        ]);
      }
    );

    // 구독 해제 이벤트
    newRoom.on(
      RoomEvent.TrackUnsubscribed,
      (_track: RemoteTrack, publication: RemoteTrackPublication) => {
        setRemoteTracks((prev) =>
          prev.filter(
            (track) => track.trackPublication.trackSid !== publication.trackSid
          )
        );
      }
    );

    try {
      const permission = await getLocalMedia();
      if (!permission) throw new Error("Media access denied");

      const token = await getToken(courseId, lectureId, role);

      await newRoom.connect(LIVEKIT_URL, token);
      await newRoom.localParticipant.enableCameraAndMicrophone();
      setLocalTrack(
        newRoom.localParticipant.videoTrackPublications.values().next().value
          .videoTrack
      );
    } catch (error) {
      console.log(
        "There was an error connecting to the room:",
        (error as Error).message
      );
      await newRoom.disconnect();
    }
  };
  const leaveRoom = async () => {
    console.log("Leaving room...");
    await room?.disconnect();
    setRoom(undefined);
    setLocalTrack(undefined);
    setRemoteTracks([]);
  };

  const getToken = async (
    courseId: string,
    lectureId: string,
    role: string
  ) => {
    const type = role == "ROLE_STUDENT" ? "student" : "instructor";

    const res = await restClient.post(
      `/livekit/${type}/token`,
      { lectureId: lectureId, courseId: courseId },
      { requireAuth: true }
    );
    if (res.data.status !== "success") {
      const error = res.data.message;
      throw new Error(`Failed to get token: ${error}`);
    }
    const data = res.data.data;
    console.log(`token:${res.data.data}`);
    return data.token;
  };

  return { room, localTrack, remoteTracks, joinRoom, leaveRoom };
}
