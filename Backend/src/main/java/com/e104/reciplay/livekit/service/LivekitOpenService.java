package com.e104.reciplay.livekit.service;

public interface LivekitOpenService {
    String createInstructorToken(Long lectureId, Long courseId);
    String createStudentToken(Long lectureId, Long courseId);

}
