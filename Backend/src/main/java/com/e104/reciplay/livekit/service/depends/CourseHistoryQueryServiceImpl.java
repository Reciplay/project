package com.e104.reciplay.livekit.service.depends;

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
        return courseHistoryRepository.existsByUserIdAndCourseIdAndIsEnrollmented(userId, courseId, true);
    }
}
