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
import restClient from '@/lib/axios/restClient';
import { getSession } from 'next-auth/react';
import { ApiResponse } from '@/types/apiResponse';

let APPLICATION_SERVER_URL = "http://i13e104.p.ssafy.io:8080/";
let LIVEKIT_URL = "ws://i13e104.p.ssafy.io:7880/";

// for local test
// let APPLICATION_SERVER_URL = "/test/local/"
// let LIVEKIT_URL = "ws://localhost:7880"

export type TrackInfo = {
  trackPublication: RemoteTrackPublication;
  participantIdentity: string;
};
/**
 * useVideoChat
 * -----------------------------
 * LiveKit 기반의 화상 회의 기능을 관리하는 React 커스텀 훅
 * - 방 입장 / 퇴장
 * - 로컬 카메라·마이크 활성화
 * - 원격 참가자의 트랙 구독/해제 관리
 * - LiveKit 토큰 발급 API 호출
 * -----------------------------
 */

export const useVideoChat = () => {
  /**
   * 상태 관리
   */
  const [room, setRoom] = useState<Room | undefined>(undefined); // 현재 접속 중인 LiveKit Room 인스턴스
  const [localTrack, setLocalTrack] = useState<LocalVideoTrack | undefined>(undefined); // 내 로컬 비디오 트랙
  const [remoteTracks, setRemoteTracks] = useState<TrackInfo[]>([]); // 원격 참가자의 트랙 목록
  const [participantName, setParticipantName] = useState(
    'Participant' + Math.floor(Math.random() * 100) // 참가자 표시 이름(랜덤)
  );
  const [roomName, setRoomName] = useState('Test Room'); // 방 이름(임시)
  const [roomId, setRoomId] = useState<string | null>(null); // 서버에서 발급받은 방 ID

  /**
   * joinRoom
   * ------------------------------------
   * 주어진 courseId, lectureId로 LiveKit 방에 연결
   * - 새로운 Room 인스턴스 생성
   * - 영상/음성 트랙 구독 → LiveKit 이벤트 기반 (이미 이 훅 안에서 처리)
   * - 브라우저 카메라/마이크 접근 권한 요청
   * - 서버에서 토큰 발급받아 방에 연결
   * - 로컬 카메라/마이크 활성화
   */
  const joinRoom = async (courseId: string, lectureId: string) => {
    const newRoom = new Room();
    setRoom(newRoom);

    // 원격 트랙 구독 이벤트 (상대방 영상/음성 들어올 때)
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

    // 원격 트랙 해제 이벤트 (상대방 나가거나 트랙 끔)
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
      // 브라우저 권한 요청
      await navigator.mediaDevices.getUserMedia({ video: true, audio: true });

      // LiveKit 접속 토큰 발급
      const token = await getToken(courseId, lectureId);

      // LiveKit 서버에 연결
      await newRoom.connect(LIVEKIT_URL, token);

      // 로컬 카메라/마이크 켜기
      await newRoom.localParticipant.enableCameraAndMicrophone();

      // 로컬 비디오 트랙 상태 저장
      setLocalTrack(
        newRoom.localParticipant.videoTrackPublications.values().next().value
          .videoTrack
      );
    } catch (error) {
      // 연결 실패 시 방 나가기 처리
      await leaveRoom();
    }
  };

  /**
   * leaveRoom
   * --------------------------
   * 현재 방 연결 해제 및 상태 초기화
   */
  const leaveRoom = async () => {
    await room?.disconnect();
    setRoom(undefined);
    setLocalTrack(undefined);
    setRemoteTracks([]);
  };

  /**
   * getToken
   * --------------------------------
   * LiveKit 방 연결용 JWT 토큰 발급 API 호출
   * - 현재 세션(role)에 따라 instructor/student 토큰 발급
   * - roomId도 함께 상태에 저장
   */
  const getToken = async (courseId: string, lectureId: string) => {
    const session = await getSession();
    const type = session?.role == "ROLE_STUDENT" ? "student" : "instructor";

    interface RoomInfo {
      token: string;
      roomId: string;
      nickname: string;
      email: string;
      lectureId: number;
    }

    const res = await restClient.post<ApiResponse<RoomInfo>>(
      `/livekit/${type}/token`,
      { lectureId: lectureId, courseId: courseId },
      { requireAuth: true }
    );

    if (res.data.status !== 'success') {
      const error = res.data.message;
      throw new Error(`Failed to get token: ${error}`);
    }

    const data = res.data.data;
    setRoomId(data.roomId); // 방 ID 저장
    return data.token; // 토큰 반환
  };

  /**
   * 반환 값
   * ------------------------------
   * - room: 현재 Room 인스턴스
   * - roomId: 서버 발급 방 ID
   * - localTrack: 내 영상 트랙
   * - remoteTracks: 원격 참가자 트랙 목록
   * - participantName / setParticipantName: 참가자 표시 이름 관리
   * - roomName / setRoomName: 방 이름 관리
   * - joinRoom: 방 입장 함수
   * - leaveRoom: 방 퇴장 함수
   */
  return {
    room,
    roomId,
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
