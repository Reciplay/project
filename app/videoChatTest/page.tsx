"use client";

import { useCallback, useRef, useState } from "react";
import AudioComponent from "../VideoChat/components/AudioComponent";
import LocalVideo from "../VideoChat/components/LocalVideo";
import RemoteVideo from "../VideoChat/components/RemoteVideo";
import NodeDisplay from "../VideoChat/components/NodeDisplay";
import GestureDisplay from "../VideoChat/components/GestureDisplay";
import { recognizeGesture } from "../VideoChat/lib/gestureRecognizer";
import styles from "./page.module.css";
import { useVideoChat } from "../../hooks/useVideoChat";

type Node = {
  x: number;
  y: number;
  z: number;
  visibility: number;
};

function VideoChatTestPage() {
    const {
        room,
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

    const handleNodesDetected = useCallback((detectedNodes: any) => {
        if (detectedNodes.length > 0) {
            const landmarks = detectedNodes[0];
            setNodes(landmarks);

            const now = performance.now();
            if (now - lastGestureCheck.current > 100) { // Check every 100ms
                lastGestureCheck.current = now;
                const newGesture = recognizeGesture(landmarks);
                setGesture(prev => newGesture !== prev ? newGesture : prev);
            }
        }
    }, []);

    const handleLeaveRoom = () => {
        leaveRoom();
        setNodes([]);
        setGesture("");
    }

    return (
        <>
            <h1>Video Chat Test Page</h1>
            {!room ? (
                <div id="join">
                    <div id="join-dialog">
                        <h2>Join a Video Room</h2>
                        <form
                            onSubmit={(e) => {
                                joinRoom();
                                e.preventDefault();
                            }}
                        >
                          // 참가자 정보 표시
                            <div>
                                <label htmlFor="participant-name">Participant</label>
                                <input
                                    id="participant-name"
                                    className="form-control"
                                    type="text"
                                    value={participantName}
                                    onChange={(e) => setParticipantName(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="room-name">Room</label>
                                <input
                                    id="room-name"
                                    className="form-control"
                                    type="text"
                                    value={roomName}
                                    onChange={(e) => setRoomName(e.target.value)}
                                    required
                                />
                            </div>
                            <button
                                className="btn btn-lg btn-success"
                                type="submit"
                                disabled={!roomName || !participantName}
                            >
                                Join!
                            </button>
                        </form>
                    </div>
                </div> 
            ) : (
              // 방
                <div id="room">
                    <div id="room-header">
                      //방 제목
                        <h2 id="room-title">{roomName}</h2>
                        // 방 나가기 버튼
                        <button className="btn btn-danger" id="leave-room-button" onClick={handleLeaveRoom}>
                            Leave Room
                        </button>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                        <GestureDisplay gesture={gesture} />
                        <div id="layout-container" className={styles.videoContainer}>
                          // 내 화면
                            {localTrack && (
                                <LocalVideo
                                    track={localTrack}
                                    participantIdentity={participantName}
                                    onNodesDetected={handleNodesDetected}
                                />
                            )}
                            // 다른 화면
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
            )}
        </>
    );
}

export default VideoChatTestPage;
