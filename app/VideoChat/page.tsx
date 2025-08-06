"use client";

import { useCallback, useRef, useState } from "react";
import AudioComponent from "./components/AudioComponent";
import LocalVideo from "./components/LocalVideo";
import RemoteVideo from "./components/RemoteVideo";
import NodeDisplay from "./components/NodeDisplay";
import GestureDisplay from "./components/GestureDisplay";
import { recognizeGesture } from "./lib/gestureRecognizer";
import styles from "./page.module.css";
import { useVideoChat } from "../../hooks/useVideoChat";

type Node = {
  x: number;
  y: number;
  z: number;
  visibility: number;
};

function VideoApp() {
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
                          // 참가자 이름 표시
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
        <div id="room">
          <div id="room-header">
            <h2 id="room-title">{roomName}</h2>
                        // 떠나기 버튼
            <button className="btn btn-danger" id="leave-room-button" onClick={handleLeaveRoom}>
              Leave Room
            </button>
          </div>
                    // 표시
          <div style={{ display: 'flex', flexDirection: 'row' }}>
            <GestureDisplay gesture={gesture} />
            <div id="layout-container" className={styles.videoContainer}>
              {localTrack && (
                <LocalVideo
                  track={localTrack}
                  participantIdentity={participantName}
                  onNodesDetected={handleNodesDetected}
                />
              )}
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

export default VideoApp;
