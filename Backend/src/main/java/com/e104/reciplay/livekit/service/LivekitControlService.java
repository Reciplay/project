package com.e104.reciplay.livekit.service;

public interface LivekitControlService {
    void disconnectStudent(Long lectureId, String targetEmail);
    void muteStudent(Long lectureId, String targetEmail);
    void unpublishStudent(String roomName, String targetEmail);
}
