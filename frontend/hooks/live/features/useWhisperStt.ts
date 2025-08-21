import { useRef, useState } from "react";

interface UseWhisperSttOptions {
  onFinished: (transcript: string) => void;
}

export const useWhisperStt = ({ onFinished }: UseWhisperSttOptions) => {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const stopTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const stopRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === "recording"
    ) {
      mediaRecorderRef.current.stop();
    }
    if (stopTimeoutRef.current) {
      clearTimeout(stopTimeoutRef.current);
      stopTimeoutRef.current = null;
    }
  };

  const startRecording = async () => {
    if (isRecording) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });
        audioChunksRef.current = [];
        stream.getTracks().forEach((track) => track.stop()); // Stop microphone access

        if (audioBlob.size > 0) {
          await sendToWhisper(audioBlob);
        }
        setIsRecording(false);
      };

      audioChunksRef.current = [];
      mediaRecorder.start();
      setIsRecording(true);

      // 3초 후 자동으로 녹음 중지
      stopTimeoutRef.current = setTimeout(stopRecording, 3000);
    } catch (error) {
      console.error("Error accessing microphone:", error);
      setIsRecording(false);
    }
  };

  const sendToWhisper = async (audioBlob: Blob) => {
    const formData = new FormData();
    formData.append("file", audioBlob, "recording.webm");
    formData.append("model", "whisper-1");

    try {
      const response = await fetch("/chatbot/whisper", {
        method: "POST",
        headers: {
          Authorization: `Bearer`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const result = await response.json();
      const transcript = result.text || "";
      onFinished(transcript);
    } catch (error) {
      console.error("Error sending audio to Whisper API:", error);
      onFinished(""); // 에러 발생 시 빈 문자열 전달
    }
  };

  return { isRecording, startRecording };
};
