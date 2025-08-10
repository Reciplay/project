package com.e104.reciplay.repository;

import com.e104.reciplay.entity.CourseHistory;
import com.e104.reciplay.repository.custom.CustomCourseHistoryRepository;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;


public interface CourseHistoryRepository extends JpaRepository<CourseHistory, Long>, CustomCourseHistoryRepository {
    boolean existsByUserIdAndCourseIdAndIsEnrolled(Long userId, Long courseId, boolean isEnrolled);
    Long countByCourseId(Long courseId);

    Optional<CourseHistory> findByCourseIdAndUserId(Long courseId, Long userId);
}
