import axios from "axios";
import { getSession } from "next-auth/react";
import { useCallback } from "react";

interface ParticipantActionsProps {
  roomId: string | null;
  email: string | undefined;
  lectureId: string;
}

const ENDPOINT = "";

export const useParticipantActions = ({
  roomId,
  email,
  lectureId,
}: ParticipantActionsProps) => {
  //live/remove
  // 강퇴 ( 강사 )

  // livekit/lecture - delete
  // 방송 종료 ( 강사 )

  const muteAudio = useCallback(async () => {
    if (!roomId || !email || !lectureId) return;
    try {
      const session = await getSession();
      const accessToken = session?.accessToken;
      if (!accessToken) {
        console.error("Access token not found.");
        return;
      }

      await axios.get(`${ENDPOINT}/mute-audio`, {
        params: {
          roomId,
          targetEmail: email,
          lectureId: Number(lectureId),
        },
        withCredentials: true,
        headers: {
          Authorization: `${accessToken}`,
        },
      });
      console.log("Mute audio API call successful");
    } catch (error) {
      console.error("Failed to mute audio:", error);
    }
  }, [roomId, email, lectureId]);

  const unMuteAudio = useCallback(async () => {
    if (!roomId || !email || !lectureId) return;
    try {
      const session = await getSession();
      const accessToken = session?.accessToken;
      if (!accessToken) {
        console.error("Access token not found.");
        return;
      }

      await axios.get(`${ENDPOINT}/unmute-audio`, {
        params: {
          roomId,
          targetEmail: email,
          lectureId: Number(lectureId),
        },
        withCredentials: true,
        headers: {
          Authorization: `${accessToken}`,
        },
      });
      console.log("Unmute audio API call successful");
    } catch (error) {
      console.error("Failed to unmute audio:", error);
    }
  }, [roomId, email, lectureId]);

  const muteVideo = useCallback(async () => {
    if (!roomId || !email || !lectureId) return;
    try {
      const session = await getSession();
      const accessToken = session?.accessToken;
      if (!accessToken) {
        console.error("Access token not found.");
        return;
      }

      await axios.get(`${ENDPOINT}/mute-video`, {
        params: {
          roomId,
          targetEmail: email,
          lectureId: Number(lectureId),
        },
        withCredentials: true,
        headers: {
          Authorization: `${accessToken}`,
        },
      });
      console.log("Mute video API call successful");
    } catch (error) {
      console.error("Failed to mute video:", error);
    }
  }, [roomId, email, lectureId]);

  const unMuteVideo = useCallback(async () => {
    if (!roomId || !email || !lectureId) return;
    try {
      const session = await getSession();
      const accessToken = session?.accessToken;
      if (!accessToken) {
        console.error("Access token not found.");
        return;
      }

      await axios.get(`${ENDPOINT}/unmute-video`, {
        params: {
          roomId,
          targetEmail: email,
          lectureId: Number(lectureId),
        },
        withCredentials: true,
        headers: {
          Authorization: `${accessToken}`,
        },
      });
      console.log("Unmute video API call successful");
    } catch (error) {
      console.error("Failed to unmute video:", error);
    }
  }, [roomId, email, lectureId]);

  return { muteAudio, unMuteAudio, muteVideo, unMuteVideo };
};
