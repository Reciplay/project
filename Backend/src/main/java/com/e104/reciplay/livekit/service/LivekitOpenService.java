package com.e104.reciplay.livekit.service;

import com.e104.reciplay.livekit.dto.request.CloseLiveRequest;
import com.e104.reciplay.livekit.dto.response.LivekitTokenResponse;

public interface LivekitOpenService {
    LivekitTokenResponse createInstructorToken(Long lectureId, Long courseId);
    LivekitTokenResponse createStudentToken(Long lectureId, Long courseId);

    void prepareChatbot(Long lectureId);
    void closeLiveRoom(CloseLiveRequest request, String email);
}
