package com.e104.reciplay.livekit.service.depends;

import com.e104.reciplay.entity.CourseHistory;

public interface CourseHistoryQueryService {
    boolean enrolled(Long userId, Long courseId);

    Long countEnrollmentsOf(Long courseId);

    CourseHistory queryCourseHistory(Long courseId, Long userId);
}
