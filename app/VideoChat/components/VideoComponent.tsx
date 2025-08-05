import { LocalVideoTrack, RemoteVideoTrack } from "livekit-client";
import "./VideoComponent.css";
import { memo, useEffect, useRef, useState } from "react";
import { PoseLandmarker, FilesetResolver, DrawingUtils, Landmark } from "@mediapipe/tasks-vision";

let poseLandmarker: PoseLandmarker;
const createPoseLandmarker = async () => {
    const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.9/wasm"
    );

    poseLandmarker = await PoseLandmarker.createFromOptions(vision, {
        baseOptions: {
            modelAssetPath:
                "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task",
            delegate: "GPU"
        },
        runningMode: "VIDEO",
        numPoses: 2
    });
};

async function poseRecognition(
    video: HTMLVideoElement,
    canvas: HTMLCanvasElement,
    setLandmarksData: (landmarks: Landmark[][]) => void,
    onNodesDetected: (nodes: Landmark[][]) => void
): Promise<() => void> {
    const canvasCtx = canvas.getContext("2d");
    if (!canvasCtx) {
        return () => {};
    }

    const drawingUtils = new DrawingUtils(canvasCtx);

    let lastVideoTime = -1;
    let animationFrameId: number;

    const renderLoop = () => {
        if (video.videoWidth > 0 && video.videoHeight > 0 && video.currentTime !== lastVideoTime) {
            const timeStamp = performance.now();
            const poseLandmarkerResult = poseLandmarker.detectForVideo(video, timeStamp);

            canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
            if (poseLandmarkerResult.landmarks) {
                setLandmarksData(poseLandmarkerResult.landmarks);
                onNodesDetected(poseLandmarkerResult.landmarks);
                for (const landmarks of poseLandmarkerResult.landmarks) {
                    for (const landmark of landmarks) {
                        const x = landmark.x * canvas.width;
                        const y = landmark.y * canvas.height;
                        const radius = 3;

                        // 바깥쪽 흰색 원 (외곽선)
                        canvasCtx.beginPath();
                        canvasCtx.arc(x, y, radius + 1.5, 0, 2 * Math.PI);
                        canvasCtx.fillStyle = "white";
                        canvasCtx.fill();

                        // 안쪽 검은색 원
                        canvasCtx.beginPath();
                        canvasCtx.arc(x, y, radius, 0, 2 * Math.PI);
                        canvasCtx.fillStyle = "black";
                        canvasCtx.fill();
                    }

                    // 선은 그대로 사용
                    drawingUtils.drawConnectors(landmarks, PoseLandmarker.POSE_CONNECTIONS, {
                        color: "white",
                        lineWidth: 1
                    });
                }
            }
            lastVideoTime = video.currentTime;
        }
        animationFrameId = requestAnimationFrame(renderLoop);
    };
    renderLoop();

    return () => {
        cancelAnimationFrame(animationFrameId);
    };
}


interface VideoComponentProps {
    track: LocalVideoTrack | RemoteVideoTrack;
    participantIdentity: string;
    local?: boolean;
    onNodesDetected: (nodes: Landmark[][]) => void;
}


const VideoComponent = memo(function VideoComponent({ track, participantIdentity, local = false, onNodesDetected }: VideoComponentProps) {
    const videoElement = useRef<HTMLVideoElement | null>(null);
    const canvasElement = useRef<HTMLCanvasElement | null>(null);
    const [landmarksData, setLandmarksData] = useState<Landmark[][]>([]);

    useEffect(() => {
        let cleanup: (() => void) | undefined;
        const video = videoElement.current;
        const canvas = canvasElement.current;

        if (video && canvas) {
            track.attach(video);

            const handleMetadataLoaded = () => {
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                createPoseLandmarker().then(() => {
                    poseRecognition(video, canvas, setLandmarksData, onNodesDetected).then(
                        (returnedCleanup) => {
                            cleanup = returnedCleanup;
                        }
                    );
                });
            };

            video.addEventListener("loadedmetadata", handleMetadataLoaded);

            // Cleanup function
            return () => {
                video.removeEventListener("loadedmetadata", handleMetadataLoaded);
                track.detach();
                if (cleanup) {
                    cleanup();
                }
            };
        }

        return () => {
            track.detach();
            if (cleanup) {
                cleanup();
            }
        };
    }, [track, onNodesDetected]);

    return (
        <div id={"camera-" + participantIdentity} className="video-container">
            <div className="participant-data">
                <p>{participantIdentity + (local ? " (You)" : "")}</p>
            </div>
            <div className="media-wrapper">
                <video ref={videoElement} id={track.sid}></video>
                <canvas ref={canvasElement} className="output-canvas"></canvas>
            </div>
        </div>
    );
});

export default VideoComponent;
