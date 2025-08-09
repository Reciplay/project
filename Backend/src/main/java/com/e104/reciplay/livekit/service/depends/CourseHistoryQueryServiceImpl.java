package com.e104.reciplay.livekit.service.depends;

import com.e104.reciplay.entity.CourseHistory;
import com.e104.reciplay.repository.CourseHistoryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class CourseHistoryQueryServiceImpl implements CourseHistoryQueryService{
    private final CourseHistoryRepository courseHistoryRepository;

    @Override
    public boolean enrolled(Long userId, Long courseId) {
        return courseHistoryRepository.existsByUserIdAndCourseIdAndIsEnrolled(userId, courseId, true);
    }

    @Override
    public Long countEnrollmentsOf(Long courseId) {
        return courseHistoryRepository.countByCourseId(courseId);
    }

    @Override
    public CourseHistory queryCourseHistory(Long courseId, Long userId) {
        return courseHistoryRepository.findByCourseIdAndUserId(courseId, userId)
                .orElseThrow(() -> new IllegalArgumentException("해당하는 수강 이력이 없습니다."));
    }
}
