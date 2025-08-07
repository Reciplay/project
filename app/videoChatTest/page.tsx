"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import AudioComponent from "../VideoChat/components/AudioComponent";
import LocalVideo from "../VideoChat/components/LocalVideo";
import RemoteVideo from "../VideoChat/components/RemoteVideo";
import NodeDisplay from "../VideoChat/components/NodeDisplay";
import GestureDisplay from "../VideoChat/components/GestureDisplay";
import { recognizeGesture } from "../VideoChat/lib/gestureRecognizer";
import styles from "./page.module.css";
import { useVideoChat } from "../../hooks/useVideoChat";
import { getToken } from "next-auth/jwt";
import { useParams } from "next/navigation";
import { useTodoStore } from "@/stores/todoStore";
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';


interface Props {
    lectureId: string;
}

// 타입
type Node = {
    x: number;
    y: number;
    z: number;
    visibility: number;
};

function VideoChatTestPage() {
    const {
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
    } = useVideoChat();

    const [nodes, setNodes] = useState<Node[]>([]);
    const [gesture, setGesture] = useState("");
    const lastGestureCheck = useRef(0);


    const params = useParams();
    const courseId = params.courseId as string;
    const lectureId = params.lectureId as string;


    // 💡 입장 로직: 페이지 진입 시 바로 실행
    useEffect(() => {
        const enterRoom = async () => {
            try {


                await joinRoom(courseId, lectureId);
            } catch (e) {
                console.error("방 입장 실패:", e);
                alert("방 입장에 실패했습니다.");
            }
        };

        enterRoom();
    }, []);


    // 제스처 처리
    const handleNodesDetected = useCallback((detectedNodes: any) => {
        if (detectedNodes.length > 0) {
            const landmarks = detectedNodes[0];
            setNodes(landmarks);

            const now = performance.now();
            if (now - lastGestureCheck.current > 100) {
                lastGestureCheck.current = now;
                const newGesture = recognizeGesture(landmarks);
                setGesture((prev) => (newGesture !== prev ? newGesture : prev));
            }
        }
    }, []);

    const handleLeaveRoom = () => {
        leaveRoom();
        setNodes([]);
        setGesture("");
    };

    return (
        <div id="room">
            <div id="room-header">
                <h2 id="room-title">{roomName}</h2>
                <button className="btn btn-danger" id="leave-room-button" onClick={handleLeaveRoom}>
                    Leave Room
                </button>
            </div>

            <div style={{ display: "flex", flexDirection: "row" }}>
                <GestureDisplay gesture={gesture} />
                <div id="layout-container" className={styles.videoContainer}>
                    {/* 내 화면 */}
                    {localTrack && (
                        <LocalVideo
                            track={localTrack}
                            participantIdentity={participantName}
                            onNodesDetected={handleNodesDetected}
                        />
                    )}

                    {/* 상대방 화면 */}
                    {remoteTracks.map((remoteTrack) =>
                        remoteTrack.trackPublication.kind === "video" ? (
                            <RemoteVideo
                                key={remoteTrack.trackPublication.trackSid}
                                trackPublication={remoteTrack.trackPublication}
                                participantIdentity={remoteTrack.participantIdentity}
                                onNodesDetected={handleNodesDetected}
                            />
                        ) : (
                            <AudioComponent
                                key={remoteTrack.trackPublication.trackSid}
                                track={remoteTrack.trackPublication.audioTrack!}
                            />
                        )
                    )}
                </div>

                <NodeDisplay nodes={nodes} />
            </div>
        </div>
    );
}

export default VideoChatTestPage;
