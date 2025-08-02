package com.e104.reciplay.livekit.service.depends;

public interface CourseHistoryQueryService {
    boolean enrolled(Long userId, Long courseId);
}
