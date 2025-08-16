// "use client";

// import VideoSection from "@/components/live/videoSection";
// import { LocalTrackPublication, RemoteTrackPublication } from "livekit-client"; // Assuming these types are available
// import { useMemo } from "react";
// import styles from "./videoGrid.module.scss";

// interface VideoGridProps {
//   localTrack: LocalTrackPublication | null;
//   remoteTracks: RemoteTrackPublication[];
//   userId: string;
//   handleNodesDetected: (nodes: any) => void; // Replace 'any' with actual type if known
//   setGesture: (gesture: any) => void; // Replace 'any' with actual type if known
// }

// export default function VideoGrid({
//   localTrack,
//   remoteTracks,
//   userId,
//   handleNodesDetected,
//   setGesture,
// }: VideoGridProps) {
//   const allParticipants = useMemo(() => {
//     const participants = [];
//     if (localTrack) {
//       participants.push({
//         trackPublication: {
//           videoTrack: localTrack,
//           audioTrack: null, // Assuming local audio is handled elsewhere or not needed for display here
//         },
//         participantIdentity: userId,
//         isLocal: true,
//       });
//     }
//     remoteTracks.forEach((remoteTrack) => {
//       const video = remoteTrack.trackPublication.videoTrack;
//       if (video) {
//         // Only add if video track exists
//         participants.push({
//           trackPublication: remoteTrack.trackPublication,
//           participantIdentity: remoteTrack.participantIdentity,
//           isLocal: false,
//         });
//       }
//     });
//     return participants;
//   }, [localTrack, remoteTracks, userId]);

//   return (
//     <div className={styles.videoGridContainer}>
//       {allParticipants.map((participant) => {
//         const video = participant.trackPublication.videoTrack;
//         const audio = participant.trackPublication.audioTrack;

//         if (!video) return null; // Should not happen if filtered above, but for safety

//         return (
//           <div
//             key={
//               participant.isLocal
//                 ? "local-video"
//                 : participant.trackPublication.trackSid
//             }
//             className={styles.videoTile}
//           >
//             {participant.isLocal ? (
//               <VideoSection
//                 videoTrack={video}
//                 participantIdentity={participant.participantIdentity}
//                 onNodesDetected={handleNodesDetected}
//                 setGesture={setGesture}
//               />
//             ) : (
//               <VideoSection
//                 videoTrack={video}
//                 audioTrack={audio}
//                 participantIdentity={participant.participantIdentity}
//               />
//             )}
//           </div>
//         );
//       })}
//     </div>
//   );
// }
