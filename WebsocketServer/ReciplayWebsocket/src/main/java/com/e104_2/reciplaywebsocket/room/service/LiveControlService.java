package com.e104_2.reciplaywebsocket.room.service;

public interface LiveControlService {
    Boolean checkParticipationHistory(String email, Long lectureId);
    void quitFromLiveRoom(String email, Long lectureId);
}
