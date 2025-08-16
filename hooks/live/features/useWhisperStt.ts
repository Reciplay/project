import { useRef, useState } from "react";

interface UseWhisperSttOptions {
  onFinished: (transcript: string) => void;
}

export const useWhisperStt = ({ onFinished }: UseWhisperSttOptions) => {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

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

      // 5초 후 자동으로 녹음 중지 (필요에 따라 조절 가능)
      setTimeout(stopRecording, 5000);
    } catch (error) {
      console.error("Error accessing microphone:", error);
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
    }
  };

  const sendToWhisper = async (audioBlob: Blob) => {
    const formData = new FormData();
    // API 명세에 따라 'file'이라는 키로 오디오 파일 추가
    formData.append("file", audioBlob, "recording.webm");
    // 'model' 필드 추가
    formData.append("model", "whisper-1");

    try {
      const response = await fetch(
        "https://gms.ssafy.io/gmsapi/api.openai.com/v1/audio/transcriptions",
        {
          method: "POST",
          headers: {
            // GMS_KEY는 환경 변수 등으로 안전하게 관리해야 합니다.
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_GMS_KEY}`,
          },
          body: formData,
        },
      );

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

  return { isRecording, startRecording, stopRecording };
};
