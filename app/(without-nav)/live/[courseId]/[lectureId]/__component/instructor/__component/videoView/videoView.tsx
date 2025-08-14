import { recognizeGesture } from "@/components/live/gestureRecognizer";
import VideoSection from "@/components/live/videoSection";
import useLivekitConnection from "@/hooks/live/useLivekitConnection";
import { getSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

/* ===== 최소 필요 타입 정의 (프로젝트 타입에 맞게 교체 가능) ===== */
type StompClientLike = { connected?: boolean } | unknown;

type SendChapterIssueArgs = {
  type: "chapter-issue";
  issuer: string;
  lectureId: number;
  roomId: string;
  chapterSequence: number;
};

type VideoViewProps = {
  stompClient: StompClientLike;
  sendChapterIssue: (
    client: StompClientLike,
    args: SendChapterIssueArgs,
  ) => void;
  roomId: string;
  roomInfo: { email?: string } | null;
};

export default function VideoView({
  stompClient,
  sendChapterIssue,
  roomId,
  roomInfo,
}: VideoViewProps) {
  const params = useParams();
  const courseId = params.courseId as string;
  const lectureId = params.lectureId as string;

  const { joinRoom, leaveRoom, localTrack, remoteTracks } =
    useLivekitConnection();

  const [role, setRole] = useState<string | null>(null);
  const [userId, setUserId] = useState("");

  // 세션에서 역할/유저 ID 읽기
  useEffect(() => {
    const fetchSession = async () => {
      const session = await getSession();
      setRole((session?.role as string | null) ?? null);
      setUserId(session?.user.id ?? "");
    };
    fetchSession();
  }, []);

  // role 준비되면 LiveKit 입장/퇴장
  useEffect(() => {
    if (!role) return;
    joinRoom(courseId, lectureId, role);
    return () => {
      leaveRoom();
    };
  }, [courseId, lectureId, role, joinRoom, leaveRoom]);

  const [handGesture, setHandGesture] = useState("");
  const lastHandGestureCheck = useRef(0);

  const handleHandGesture = useCallback((value: string) => {
    const now = Date.now();
    if (now - lastHandGestureCheck.current > 1000) {
      lastHandGestureCheck.current = now;
      setHandGesture((prev) => (prev === value ? prev : value));
      if (value && value !== "None") {
        console.log("Hand Gesture recognized:", value);
      }
    }
  }, []);

  const lastGestureCheck = useRef(0);
  const [recognizedPose, setPose] = useState("");

  // ✅ any 제거: 알 수 없는 배열로 받고 내부에서 좁히기
  const handleNodesDetected = useCallback((nodes: ReadonlyArray<unknown>) => {
    const now = Date.now();
    if (now - lastGestureCheck.current > 1000) {
      lastGestureCheck.current = now;
      if (Array.isArray(nodes) && nodes.length > 0) {
        const newGesture = recognizeGesture(nodes[0]);
        if (newGesture) {
          console.log("Gesture recognized:", newGesture);
          setPose(newGesture);
        }
      }
    }
  }, []); // recognizeGesture는 정적 import → deps 불필요

  // issuer 메모 (props 객체 대신 구체 필드만 의존)
  const issuer = useMemo(() => roomInfo?.email ?? "", [roomInfo?.email]);

  const lastGestureSended = useRef(0);

  // 제스처 이벤트 전송
  useEffect(() => {
    const now = Date.now();
    if (now - lastGestureSended.current <= 2000) return;
    lastGestureSended.current = now;

    if (!stompClient || !issuer || !roomId) return;

    if (recognizedPose === "Clap") {
      console.log("박수실행됨==================================");
      sendChapterIssue(stompClient, {
        type: "chapter-issue",
        issuer,
        lectureId: Number(lectureId), // 서버가 number 기대한다면 Number 변환
        roomId,
        chapterSequence: 1,
      });
    }

    // handGesture 사용 예시가 필요하면 아래에 추가
    // if (handGesture === "Closed_Fist") { ... }

    // eslint가 요구한 의존성들 모두 명시
  }, [
    recognizedPose,
    handGesture,
    stompClient,
    sendChapterIssue,
    issuer,
    roomId,
    lectureId,
  ]);

  return (
    <div style={{ padding: 24 }}>
      {/* 로컬 비디오 */}
      {localTrack ? (
        <VideoSection
          videoTrack={localTrack}
          participantIdentity={userId}
          onNodesDetected={handleNodesDetected}
          setGesture={handleHandGesture}
        />
      ) : (
        <p>비디오 연결 중...</p>
      )}

      {/* 원격 비디오 */}
      <div>
        {remoteTracks.map((remoteTrack) => {
          const video = remoteTrack.trackPublication.videoTrack;
          const audio = remoteTrack.trackPublication.audioTrack;

          console.log("🔍 remote remoteTrack:", remoteTrack);
          console.log("🎥 remote videoTrack:", video);
          console.log("🔊 remote audioTrack:", audio);

          if (!video) {
            console.warn(
              `⚠️ videoTrack 없음 → publication: ${remoteTrack.trackPublication.trackName}`,
            );
            return null;
          }

          return (
            <VideoSection
              key={remoteTrack.trackPublication.trackSid}
              videoTrack={video}
              audioTrack={audio}
              participantIdentity={remoteTrack.participantIdentity}
            />
          );
        })}
      </div>
    </div>
  );
}
