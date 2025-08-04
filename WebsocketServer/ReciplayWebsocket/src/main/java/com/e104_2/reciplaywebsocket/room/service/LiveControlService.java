package com.e104_2.reciplaywebsocket.room.service;

import livekit.LivekitModels;

import java.io.IOException;

public interface LiveControlService {
    Boolean checkParticipationPrivilege(String email, Long lectureId);
    void quitFromLiveRoom(String email, Long lectureId);
    void removeParticipant(Long lectureId, String email, String userEmail) throws IOException;
    void verifyRemovePrivilege(Long lectureId, String email, String userEmail);

    void muteAudio(Long lectureId, String email, String userEmail) throws IOException;
    void verifyAudioMutePrivilege(Long lectureId, String email, String userEmail);

    void unmuteAudio(Long lectureId, String email, String userEmail) throws IOException;
    void muteVideo(Long lectureId, String email, String userEmail) throws  IOException;

    void unmuteVideo(Long lectureId, String email, String userEmail) throws  IOException;

    void verifyVideoMutePrivilege(Long lectureId, String email, String userEmail);

    void mutePublishedChannel(String roomName, String identity, LivekitModels.TrackType type, boolean mute) throws IOException;
}
