package com.e104_2.reciplaywebsocket.room.service;

import java.io.IOException;

public interface LiveControlService {
    Boolean checkParticipationPrivilege(String email, Long lectureId);
    void quitFromLiveRoom(String email, Long lectureId);
    void removeParticipant(Long lectureId, String email, String userEmail) throws IOException;
    void verifyRemovePrivilege(Long lectureId, String email, String userEmail);

    void muteStudent(Long lectureId, String email, String userEmail) throws IOException;
    void verifyMutePrivilege(Long lectureId, String email, String userEmail);

    void unpublishStudent(String roomName, String targetEmail);
}
