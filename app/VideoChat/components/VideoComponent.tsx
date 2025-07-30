import { LocalVideoTrack, RemoteVideoTrack } from "livekit-client";
import "./VideoComponent.css";
import { useEffect, useRef } from "react";
import { HandLandmarker, FilesetResolver, DrawingUtils } from "@mediapipe/tasks-vision";

let handLandmarker: HandLandmarker;
const createHandLandmarker = async () => {
    const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.9/wasm"
    );

    handLandmarker = await HandLandmarker.createFromOptions(vision, {
        baseOptions: {
            modelAssetPath:
                "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task",
            delegate: "GPU"
        },
        runningMode: "VIDEO",
        numHands : 2
    });
};

async function handDetection(video: HTMLVideoElement, canvas: HTMLCanvasElement) {
    const canvasCtx = canvas.getContext("2d");
    if (!canvasCtx) {
        return;
    }

    const drawingUtils = new DrawingUtils(canvasCtx);

    let lastVideoTime = -1;
    const renderLoop = () => {
        if (video.currentTime !== lastVideoTime) {
            const handLandmarkerResult = handLandmarker.detectForVideo(video, Date.now());

            canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
            if (handLandmarkerResult.landmarks) {
                for (const landmarks of handLandmarkerResult.landmarks) {
                    drawingUtils.drawLandmarks(landmarks, {
                        color: "#FF0000",
                        lineWidth: 2
                    });
                    drawingUtils.drawConnectors(landmarks, HandLandmarker.HAND_CONNECTIONS, {
                        color: "#00FF00",
                        lineWidth: 1
                    });
                }
            }
            lastVideoTime = video.currentTime;
        }
        requestAnimationFrame(renderLoop);
    };
    renderLoop();
}


interface VideoComponentProps {
    track: LocalVideoTrack | RemoteVideoTrack;
    participantIdentity: string;
    local?: boolean;
}


function VideoComponent({ track, participantIdentity, local = false }: VideoComponentProps) {
    const videoElement = useRef<HTMLVideoElement | null>(null);
    const canvasElement = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        if (videoElement.current && canvasElement.current) {
            track.attach(videoElement.current);
            const currentVideo = videoElement.current;
            const currentCanvas = canvasElement.current;
            createHandLandmarker().then(() => {
                handDetection(currentVideo, currentCanvas);
            });
        }

        return () => {
            track.detach();
        };
    }, [track]);

    return (
        <div id={"camera-" + participantIdentity} className="video-container">
            <div className="participant-data">
                <p>{participantIdentity + (local ? " (You)" : "")}</p>
            </div>
            <video ref={videoElement} id={track.sid}></video>
            <div>
                <canvas ref={canvasElement} className="output-canvas"></canvas>
            </div>
        </div>
    );
}

export default VideoComponent;
