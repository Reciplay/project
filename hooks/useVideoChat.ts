"use client";

import { useState, useCallback, useRef } from 'react';
import {
  Room,
  RoomEvent,
  RemoteTrack,
  RemoteTrackPublication,
  RemoteParticipant,
  LocalVideoTrack,
} from 'livekit-client';

// let APPLICATION_SERVER_URL = "http://i13e104.p.ssafy.io:8080/";
// let LIVEKIT_URL = "ws://i13e104.p.ssafy.io:7880/";

// for local test
let APPLICATION_SERVER_URL = "/test/local/"
let LIVEKIT_URL = "ws://localhost:7880"

export type TrackInfo = {
  trackPublication: RemoteTrackPublication;
  participantIdentity: string;
};

export const useVideoChat = () => {
  const [room, setRoom] = useState<Room | undefined>(undefined);
  const [localTrack, setLocalTrack] = useState<LocalVideoTrack | undefined>(undefined);
  const [remoteTracks, setRemoteTracks] = useState<TrackInfo[]>([]);
  const [participantName, setParticipantName] = useState(
    'Participant' + Math.floor(Math.random() * 100)
  );
  const [roomName, setRoomName] = useState('Test Room');

  const joinRoom = async () => {
    const newRoom = new Room();
    setRoom(newRoom);

    newRoom.on(
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
      await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      const token = await getToken(roomName, participantName);
      await newRoom.connect(LIVEKIT_URL, token);
      await newRoom.localParticipant.enableCameraAndMicrophone();
      setLocalTrack(
        newRoom.localParticipant.videoTrackPublications.values().next().value
          .videoTrack
      );
    } catch (error) {
      console.log(
        'There was an error connecting to the room:',
        (error as Error).message
      );
      await leaveRoom();
    }
  };

  const leaveRoom = async () => {
    await room?.disconnect();
    setRoom(undefined);
    setLocalTrack(undefined);
    setRemoteTracks([]);
  };

  const getToken = async (roomName: string, participantName: string) => {
    const response = await fetch(APPLICATION_SERVER_URL + 'token', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer eyJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Indvbmp1bkBtYWlsLmNvbSIsInJvbGUiOiJST0xFX1VTRVIiLCJpYXQiOjE3NTM4NDAzNTMsImV4cCI6MTc1NDQ0MDM1M30.XdN2T5LtkJsnz1_Mhg7vWuHZgmcWuef-xYXXSh5qFZc"
      },
      body: JSON.stringify({
        roomName: roomName,
        participantName: participantName
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Failed to get token: ${error.errorMessage}`);
    }

    const data = await response.json();
    return data.token;
  };

  return {
    room,
    localTrack,
    remoteTracks,
    participantName,
    setParticipantName,
    roomName,
    setRoomName,
    joinRoom,
    leaveRoom,
  };
};
