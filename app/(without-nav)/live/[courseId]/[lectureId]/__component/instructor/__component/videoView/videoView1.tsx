// import { recognizeGesture } from "@/components/live/gestureRecognizer";
// import VideoSection from "@/components/live/videoSection";
// import useLivekitConnection from "@/hooks/live/useLivekitConnection";
// import { getSession } from "next-auth/react";
// import { useParams } from "next/navigation";
// import { useCallback, useEffect, useRef, useState } from "react";

// // type instructorPageProps = {
// //   stompClient: Client;
// //   sendChapterIssue: (client: Client, args: SendChapterIssueArgs) => void;
// //   roomId: string;
// //   roomInfo: RoomInfo;
// // };

// export default function VideoView(props: any) {
//   const params = useParams();
//   const courseId = params.courseId as string;
//   const lectureId = params.lectureId as string;

//   const { joinRoom, leaveRoom, localTrack, remoteTracks } =
//     useLivekitConnection();

//   // 실시간 할 일 상태 -> 이 부분은 실제로는 서버에서 받아와야 함
//   //   const [todo] = useState("샘플데이터");
//   const [role, setRole] = useState<string | null>(null);
//   const [userId, setUserId] = useState("");

//   // 페이지 로드 시 역할 적용
//   useEffect(() => {
//     const fetchSession = async () => {
//       const session = await getSession();
//       setRole(session?.role ?? null);
//       setUserId(session?.user.id ?? "");
//     };

//     fetchSession();
//   }, []);

//   // role이 준비되면 joinRoom 실행
//   useEffect(() => {
//     if (!role) return;

//     joinRoom(courseId, lectureId, role);
//     return () => {
//       leaveRoom();
//     };
//   }, [courseId, lectureId, role, joinRoom, leaveRoom]);

//   const [handGesture, setHandGesture] = useState("");
//   const lastHandGestureCheck = useRef(0);

//   const handleHandGesture = useCallback((value: string) => {
//     const now = Date.now();
//     if (now - lastHandGestureCheck.current > 1000) {
//       lastHandGestureCheck.current = now;
//       setHandGesture((prev) => (prev === value ? prev : value));
//       if (value && value !== "None") {
//         console.log("Hand Gesture recognized:", value);
//       }
//     }
//   }, []);

//   const lastGestureCheck = useRef(0);
//   const [recognizedPose, setPose] = useState("");
//   const handleNodesDetected = useCallback((nodes: any) => {
//     const now = Date.now();
//     if (now - lastGestureCheck.current > 1000) {
//       lastGestureCheck.current = now;
//       if (nodes && nodes.length > 0) {
//         const newGesture = recognizeGesture(nodes[0]);
//         if (newGesture) {
//           console.log("Gesture recognized:", newGesture);
//           setPose(newGesture);
//           console.log(recognizedPose);
//         }
//       }
//     }
//   }, []);

//   //     const payload = {
//   //   type: 'chapter-issue',
//   //   roomId: args.roomId,
//   //   issuer: args.issuer,
//   //   chapterSequence: Number(args.chapterSequence),
//   //   lectureId: Number(args.lectureId),
//   //   ...(args.chapterName ? { chapterName: args.chapterName } : {}),
//   // };

//   const lastGestureSended = useRef(0);
//   useEffect(() => {
//     const now = Date.now();
//     const issuer = props.roomInfo?.email;
//     if (now - lastGestureSended.current > 2000) {
//       lastGestureSended.current = now;
//       if (recognizedPose === "Clap") {
//         console.log("박수실행됨==================================");
//         props.sendChapterIssue(props.stompClient, {
//           type: "chapter-issue",
//           issuer: issuer,
//           lectureId: lectureId,
//           roomId: props.roomId,
//           chapterSequence: 1,
//         });
//       }
//       // if (handGesture === 'Closed_Fist') {
//       //     console.log('Closed_Fist==================================')
//       //     sendHelp(props.stompClient, {
//       //         type:"help",
//       //         issuer : issuer,
//       //         lectureId : lectureId,
//       //         roomId : roomId,
//       //     })
//       // }
//     }
//   }, [recognizedPose, handGesture]);

//   return (
//     <div style={{ padding: 24 }}>
//       {/* 로컬 비디오 */}
//       {localTrack ? (
//         <VideoSection
//           videoTrack={localTrack}
//           participantIdentity={userId}
//           onNodesDetected={handleNodesDetected}
//           setGesture={handleHandGesture}
//         />
//       ) : (
//         <p>비디오 연결 중...</p>
//       )}

//       {/* 원격 비디오 */}
//       <div>
//         {remoteTracks.map((remoteTrack) => {
//           const video = remoteTrack.trackPublication.videoTrack;
//           const audio = remoteTrack.trackPublication.audioTrack;

//           console.log("🔍 remote remoteTrack:", remoteTrack);
//           console.log("🎥 remote videoTrack:", video);
//           console.log("🔊 remote audioTrack:", audio);

//           if (!video) {
//             console.warn(
//               `⚠️ videoTrack 없음 → publication: ${remoteTrack.trackPublication.trackName}`,
//             );
//             return null;
//           }

//           return (
//             <VideoSection
//               key={remoteTrack.trackPublication.trackSid}
//               videoTrack={video}
//               audioTrack={audio}
//               participantIdentity={remoteTrack.participantIdentity}
//             />
//           );
//         })}
//       </div>
//     </div>
//   );
// }
export default function VideoSection1() {
  return <div></div>;
}
