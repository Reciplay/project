'use client';

import { useEffect, useState } from 'react';
import restClient from '@/lib/axios/restClient';
import { ApiResponse } from '@/types/apiResponse';
import SockJS from "sockjs-client"
import { Stomp } from '@stomp/stompjs';
import { getSession } from 'next-auth/react';

interface RoomInfo {
  token: string;
  roomId: string;
  nickname: string;
  email: string;
  lectureId: number;
}

export function useLiveSocket(courseId: string, lectureId: string, role: 'instructor' | 'student') {
  const [roomId, setRoomId] = useState<string | null>(null);
  const [socket, setSocket] = useState<WebSocket | null>(null);

  // 1. roomId 가져오기
  useEffect(() => {
    const getRoomId = async () => {
      try {
        const res = await restClient.post<ApiResponse<RoomInfo>>(
          `/livekit/${role}/token`,
          { lectureId, courseId },
          { requireAuth: true }
        );

        if (res.data.status !== 'success') {
          throw new Error(`Failed to get token: ${res.data.message}`);
        }

        const roomId = res.data.data.roomId;
        console.log('roomId:', roomId);
        setRoomId(roomId);
      } catch (e) {
        console.error('roomId 요청 실패:', e);
      }
    };

    getRoomId();
  }, [courseId, lectureId, role]);

  // 2. WebSocket 연결
  useEffect(() => {
    if (!roomId) return;

    // ✅ SockJS 인스턴스 생성
    const socket = new SockJS('http://i13e104.p.ssafy.io:8081/ws/v1/sub');

    // ✅ STOMP 클라이언트 설정
    const stompClient = Stomp.over(socket);

    // ✅ 디버깅 로그 비활성화 or 커스텀
    stompClient.debug = (str) => {
      console.log('%c[STOMP DEBUG]', 'color: orange;', str);
    };

    // ✅ 자동 재연결 방지
    stompClient.reconnectDelay = 0;

    let subscription: any = null;

    const connectStomp = async () => {
      const session = await getSession();
      const token = session?.accessToken;

      if (!token) {
        console.error('❌ accessToken 없음');
        return;
      }

      try {
        stompClient.connect(
          {
            Authorization: `Bearer ${token}`,
          },
          (frame) => {
            console.log('✅ STOMP 연결 성공', frame);

            // ✅ 구독 시작
            subscription = stompClient.subscribe(`/ws/v1/topic/room/${roomId}`, (msg) => {
              try {
                const data = JSON.parse(msg.body);
                console.log(`📩 메시지 수신 [room/${roomId}]`, data);

                // 👉 여기서 setState 등 메시지 처리 가능
              } catch (e) {
                console.error('❌ 메시지 파싱 실패:', e, msg.body);
              }
            });
          },
          (error) => {
            console.error('❌ STOMP 연결 실패', error);
          }
        );
      } catch (e) {
        console.error('🔥 STOMP 연결 중 예외 발생:', e);
      }
    };

    socket.onopen = () => {
      console.log('✅ WebSocket 연결 성공');
      connectStomp();
    };

    socket.onclose = () => {
      console.log('🔌 WebSocket 연결 종료');
    };

    socket.onerror = (e) => {
      console.error('❌ WebSocket 오류', e);
    };

    socket.onmessage = (event) => {
      console.log('🧾 일반 메시지 수신 (raw):', event.data);
    };

    return () => {
      console.log('🧹 useLiveSocket cleanup 실행');

      // ✅ 구독 해제
      if (subscription) {
        subscription.unsubscribe();
        console.log('📴 구독 해제 완료');
      }

      // ✅ STOMP 연결 해제
      if (stompClient.connected) {
        stompClient.disconnect(() => {
          console.log('🛑 STOMP 연결 해제');
        });
      }

      // ✅ WebSocket 연결 종료
      socket.close();
    };
  }, [roomId]);



  return { roomId, socket };
}