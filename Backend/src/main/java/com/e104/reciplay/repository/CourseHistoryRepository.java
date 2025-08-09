package com.e104.reciplay.repository;

import com.e104.reciplay.entity.CourseHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CourseHistoryRepository extends JpaRepository<CourseHistory, Long> {
    boolean existsByUserIdAndCourseIdAndIsEnrolled(Long userId, Long courseId, boolean isEnrolled);
    Long countByCourseId(Long courseId);

    Optional<CourseHistory> findByCourseIdAndUserId(Long courseId, Long userId);
}
