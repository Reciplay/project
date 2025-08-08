'use client';

import { useEffect, useState, useCallback } from 'react';
import restClient from '@/lib/axios/restClient';
import { ApiResponse } from '@/types/apiResponse';
import SockJS from 'sockjs-client';
import { getSession } from 'next-auth/react';
import { Client, IMessage, StompSubscription } from '@stomp/stompjs';

interface RoomInfo {
  token: string;
  roomId: string;
  nickname: string;
  email: string;
  lectureId: number;
}

export default function useLiveSocket(
  courseId: string,
  lectureId: string,
  role: 'instructor' | 'student'
) {
  const [roomId, setRoomId] = useState<string | null>(null);
  const [socket, setSocket] = useState<SockJS | null>(null);
  const [stompClient, setStompClient] = useState<Client | null>(null);
  const [subscription, setSubscription] = useState<StompSubscription | null>(null);
  const [roomInfo, setRoomInfo] = useState<RoomInfo | null>(null);

  /** 1. roomId & roomInfo 가져오기 */
  const fetchRoomId = useCallback(async () => {
    try {
      const res = await restClient.post<ApiResponse<RoomInfo>>(
        `/livekit/${role}/token`,
        { lectureId, courseId },
        { requireAuth: true }
      );

      if (res.data.status !== 'success') {
        throw new Error(`Failed to get token: ${res.data.message}`);
      }

      const info = res.data.data;
      console.log('roomId:', info.roomId);
      setRoomInfo(info);
      setRoomId(info.roomId);
    } catch (e) {
      console.error('roomId 요청 실패:', e);
    }
  }, [courseId, lectureId, role]);

  /** 2. join 메시지 발송 */
  const sendJoin = useCallback(
    (client: Client, id: string) => {
      if (!roomInfo || !roomInfo.nickname) {
        console.error('❌ nickname 없음, join 전송 취소');
        return;
      }

      const message = {
        type: 'join',
        issuer: roomInfo.email,
        receiver: null,
        nickname: roomInfo.nickname,
        lectureId: lectureId,
        roomId: id,
        state: ['noting'],
      };
      // 이 주소(/app/join)로 메시지 보낼게
      client.publish({
        destination: '/ws/v1/app/join',
        body: JSON.stringify(message),
      });
      console.log(`➡️ Sent /ws/v1/app/join: ${JSON.stringify(message)}`);
    },
    [roomInfo, lectureId]
  );

  /** 3. SockJS + STOMP 연결 */
  const connectSocket = useCallback(
    async (id: string) => {
      const session = await getSession();
      const token = session?.accessToken;

      if (!token) {
        console.error('❌ accessToken 없음');
        return;
      }

      const sock = new SockJS('http://i13e104.p.ssafy.io:8081/ws/v1/sub');
      setSocket(sock); // cleanup에서 close 가능

      const client = new Client({
        webSocketFactory: () => sock,
        reconnectDelay: 5000,
        connectHeaders: {
          Authorization: token.startsWith('Bearer ')
            ? token
            : `Bearer ${token}`,
        },
        debug: (str) => {
          console.log('%c[STOMP DEBUG]', 'color: orange;', str);
        },
      });

      client.onConnect = (frame) => {
        console.log('✅ Connected : ', frame);

        setStompClient(client);

        console.log(`subscribe : /ws/v1/topic/room/${id}`);
        const sub = client.subscribe(`/ws/v1/topic/room/${id}`, (message: IMessage) => {
          try {
            const data = JSON.parse(message.body);
            console.log(`📩 메시지 수신 [room/${id}]`, data);
          } catch (e) {
            console.error('❌ 메시지 파싱 실패:', e, message.body);
          }
        });
        console.log(`✅ 구독 성공: /ws/v1/topic/room/${id}`);
        setSubscription(sub);

        sendJoin(client, id);
      };

      client.onStompError = (frame) => {
        console.error('❌ STOMP 오류', frame.headers['message']);
      };

      client.activate();
    },
    [sendJoin]
  );

  /** 4. cleanup */
  const cleanupConnection = useCallback(() => {
    console.log('🧹 useLiveSocket cleanup 실행');

    if (subscription) {
      subscription.unsubscribe();
      console.log('📴 구독 해제 완료');
    }

    if (stompClient) {
      stompClient.reconnectDelay = 0; // 재연결 시도 방지
      stompClient.deactivate();
      console.log('🛑 STOMP 연결 해제');
    }

    socket?.close();
  }, [subscription, stompClient, socket]);

  /** 마운트 시 roomId 요청 */
  useEffect(() => {
    fetchRoomId();
  }, [fetchRoomId]);

  /** roomId 변경 시 소켓 연결 */
  useEffect(() => {
    if (roomId) connectSocket(roomId);
    return () => cleanupConnection();
  }, [roomId]);

  return { roomId, socket, stompClient };
}
