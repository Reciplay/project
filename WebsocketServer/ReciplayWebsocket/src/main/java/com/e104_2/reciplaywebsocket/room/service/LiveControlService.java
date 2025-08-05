package com.e104_2.reciplaywebsocket.room.service;

import com.e104_2.reciplaywebsocket.room.dto.request.LiveControlRequest;
import livekit.LivekitModels;

import java.io.IOException;

public interface LiveControlService {
    Boolean checkParticipationPrivilege(String email, LiveControlRequest request);
    void quitFromLiveRoom(String email, Long lectureId);
    void removeParticipant(LiveControlRequest request, String userEmail) throws IOException;
    void verifyRemovePrivilege(Long lectureId, String email, String userEmail);

    void muteAudio(LiveControlRequest request, String userEmail) throws IOException;
    void verifyAudioMutePrivilege(Long lectureId, String email, String userEmail);

    void unmuteAudio(LiveControlRequest request, String userEmail) throws IOException;
    void muteVideo(LiveControlRequest request, String userEmail) throws  IOException;

    void unmuteVideo(LiveControlRequest request, String userEmail) throws  IOException;

    void verifyVideoMutePrivilege(Long lectureId, String email, String userEmail);

    void mutePublishedChannel(String roomName, String identity, LivekitModels.TrackType type, boolean mute) throws IOException;

    String getLiveInstructorIdentity(Long lectureId);


}
