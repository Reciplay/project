import { LocalVideoTrack, RemoteVideoTrack } from "livekit-client";
import "./VideoComponent.css";
import { useEffect, useRef, useState } from "react";
import { GestureRecognizer, HandLandmarker, FilesetResolver, DrawingUtils, Landmark } from "@mediapipe/tasks-vision";

let gestureRecognizer: GestureRecognizer;
const createGestureRecognizer = async () => {
    const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.9/wasm"
    );

    gestureRecognizer = await GestureRecognizer.createFromOptions(vision, {
        baseOptions: {
            modelAssetPath:
                "https://storage.googleapis.com/mediapipe-models/gesture_recognizer/gesture_recognizer/float16/latest/gesture_recognizer.task",
            delegate: "GPU"
        },
        runningMode: "VIDEO",
        numHands : 2
    });
};

async function gestureRecognition(
    video: HTMLVideoElement,
    canvas: HTMLCanvasElement,
    setLandmarksData: (landmarks: Landmark[][]) => void,
    setGestures: (gestures: { left: string; right: string }) => void
) {
    const canvasCtx = canvas.getContext("2d");
    if (!canvasCtx) {
        return;
    }

    const drawingUtils = new DrawingUtils(canvasCtx);

    let lastVideoTime = -1;
    const renderLoop = () => {
        if (video.currentTime !== lastVideoTime) {
            const gestureRecognizerResult = gestureRecognizer.recognizeForVideo(video, Date.now());

            canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
            if (gestureRecognizerResult.landmarks) {
                setLandmarksData(gestureRecognizerResult.landmarks);
                let gestures = { left: "No Gesture", right: "No Gesture" };
                if (gestureRecognizerResult.gestures.length > 0) {
                    for (let i = 0; i < gestureRecognizerResult.gestures.length; i++) {
                        const categoryName = gestureRecognizerResult.gestures[i][0].categoryName;
                        const categoryScore = gestureRecognizerResult.gestures[i][0].score.toFixed(2);
                        const handedness = gestureRecognizerResult.handedness[i][0].displayName;
                        if (handedness === 'Left') {
                            gestures.left = `${categoryName} (${categoryScore})`;
                        } else if (handedness === 'Right') {
                            gestures.right = `${categoryName} (${categoryScore})`;
                        }
                    }
                }
                setGestures(gestures);

                for (const landmarks of gestureRecognizerResult.landmarks) {
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
    setGestures: (gestures: { left: string; right: string }) => void;
}


function VideoComponent({ track, participantIdentity, local = false, setGestures }: VideoComponentProps) {
    const videoElement = useRef<HTMLVideoElement | null>(null);
    const canvasElement = useRef<HTMLCanvasElement | null>(null);
    const [landmarksData, setLandmarksData] = useState<Landmark[][]>([]);

    useEffect(() => {
        if (videoElement.current && canvasElement.current) {
            track.attach(videoElement.current);
            const currentVideo = videoElement.current;
            const currentCanvas = canvasElement.current;
            createGestureRecognizer().then(() => {
                gestureRecognition(currentVideo, currentCanvas, setLandmarksData, setGestures);
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
            <div className="media-wrapper">
                <video ref={videoElement} id={track.sid}></video>
                <canvas ref={canvasElement} className="output-canvas"></canvas>
            </div>
        </div>
    );
}

export default VideoComponent;
