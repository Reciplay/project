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
    setRecognizedGesture: (gesture: string) => void
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
                if (gestureRecognizerResult.gestures.length > 0) {
                    const categoryName = gestureRecognizerResult.gestures[0][0].categoryName;
                    const categoryScore = gestureRecognizerResult.gestures[0][0].score.toFixed(2);
                    const handedness = gestureRecognizerResult.handedness[0][0].displayName;
                    setRecognizedGesture(`${handedness}: ${categoryName} (${categoryScore})`);
                } else {
                    setRecognizedGesture("No Gesture");
                }

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
}


function VideoComponent({ track, participantIdentity, local = false }: VideoComponentProps) {
    const videoElement = useRef<HTMLVideoElement | null>(null);
    const canvasElement = useRef<HTMLCanvasElement | null>(null);
    const [landmarksData, setLandmarksData] = useState<Landmark[][]>([]);
    const [recognizedGesture, setRecognizedGesture] = useState<string>("No Gesture");

    useEffect(() => {
        if (videoElement.current && canvasElement.current) {
            track.attach(videoElement.current);
            const currentVideo = videoElement.current;
            const currentCanvas = canvasElement.current;
            createGestureRecognizer().then(() => {
                gestureRecognition(currentVideo, currentCanvas, setLandmarksData, setRecognizedGesture);
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
            <div className="landmark-container">
                <p>Recognized Gesture: {recognizedGesture}</p>
                <pre>{JSON.stringify(landmarksData, null, 2)}</pre>
            </div>
        </div>
    );
}

export default VideoComponent;
