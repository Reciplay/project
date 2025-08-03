"use client";

import AudioComponent from "@/app/VideoChat/components/AudioComponent";
import VideoComponent from "@/app/VideoChat/components/VideoComponent";
import {
  LocalVideoTrack,
  RemoteParticipant,
  RemoteTrack,
  RemoteTrackPublication,
  Room,
  RoomEvent,
} from "livekit-client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

type TrackInfo = {
  trackPublication: RemoteTrackPublication;
  participantIdentity: string;
};

interface VideoSectionProps {
  role?: "student" | "instructor";
  lectureId: string;
  courseId: string;
}

const LIVEKIT_URL = "ws://i13e104.p.ssafy.io:7880/";

export default function VideoSection({
  role = "student",
  courseId,
  lectureId,
}: VideoSectionProps) {
  const [room, setRoom] = useState<Room | undefined>(undefined);
  const [localTrack, setLocalTrack] = useState<LocalVideoTrack | undefined>(
    undefined
  );
  const [remoteTracks, setRemoteTracks] = useState<TrackInfo[]>([]);

  const participantName = "Participant" + Math.floor(Math.random() * 100);
  const roomName = "Test Room";

  const { data: session, status } = useSession();

  async function getToken(lectureId: string, courseId: string, role: string) {
    const accessToken = session?.accessToken;
    if (!accessToken) {
      console.warn("No access token yet; session status:", status);
      throw new Error("Access token unavailable");
    }

    const response = await fetch(
      role === "instructor"
        ? "/api/rest/livekit/instructor/token"
        : "/api/rest/livekit/student/token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: accessToken,
        },
        body: JSON.stringify({
          lectureId: Number(lectureId),
          courseId: Number(courseId),
        }),
      }
    );

    console.log(response);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to get token: ${errorText}`);
    }
    const resData = await response.json();
    return resData.data.token;
  }

  useEffect(() => {
    if (status === "authenticated") {
      joinRoom(); // joinRoom should call getToken(role, lectureId, courseId) internally
    }
  }, [status]);

  async function joinRoom() {
    const room = new Room();
    setRoom(room);

    room.on(
      RoomEvent.TrackSubscribed,
      (
        _track: RemoteTrack,
        publication: RemoteTrackPublication,
        participant: RemoteParticipant
      ) => {
        setRemoteTracks((prev) => [
          ...prev,
          {
            trackPublication: publication,
            participantIdentity: participant.identity,
          },
        ]);
      }
    );

    room.on(
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
      await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      const token = await getToken(lectureId, courseId, role);
      await room.connect(LIVEKIT_URL, token);
      await room.localParticipant.enableCameraAndMicrophone();
      setLocalTrack(
        room.localParticipant.videoTrackPublications.values().next().value
          .videoTrack
      );
    } catch (error) {
      console.log(
        "There was an error connecting to the room:",
        (error as Error).message
      );
      await leaveRoom();
    }
  }

  async function leaveRoom() {
    await room?.disconnect();
    setRoom(undefined);
    setLocalTrack(undefined);
    setRemoteTracks([]);
  }

  useEffect(() => {
    joinRoom();
  }, []);

  const mainVideoTrack =
    remoteTracks.find((t) => t.trackPublication.kind === "video")
      ?.trackPublication.videoTrack ?? localTrack;

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      {mainVideoTrack && (
        <VideoComponent
          track={mainVideoTrack}
          participantIdentity={
            mainVideoTrack === localTrack
              ? participantName
              : remoteTracks.find(
                  (t) => t.trackPublication.videoTrack === mainVideoTrack
                )?.participantIdentity || ""
          }
          local={mainVideoTrack === localTrack}
          // style={{ width: "100%", height: "100%" }}
        />
      )}

      {localTrack && mainVideoTrack !== localTrack && (
        <div
          style={{
            position: "absolute",
            bottom: 16,
            right: 16,
            width: 160,
            height: 120,
            border: "2px solid white",
            borderRadius: 8,
            overflow: "hidden",
            zIndex: 10,
            backgroundColor: "black",
          }}
        >
          <VideoComponent
            track={localTrack}
            participantIdentity={participantName}
            local={true}
            // style={{ width: "100%", height: "100%" }}
          />
        </div>
      )}

      <div>
        {remoteTracks
          .filter(
            (remoteTrack) => remoteTrack.trackPublication.kind !== "video"
          )
          .map((remoteTrack) => (
            <AudioComponent
              key={remoteTrack.trackPublication.trackSid}
              track={remoteTrack.trackPublication.audioTrack!}
            />
          ))}
      </div>
    </div>
  );
}
