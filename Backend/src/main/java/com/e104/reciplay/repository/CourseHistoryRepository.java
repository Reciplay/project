package com.e104.reciplay.repository;

import com.e104.reciplay.entity.CourseHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CourseHistoryRepository extends JpaRepository<CourseHistory, Long> {
    boolean existsByUserIdAndCourseIdAndIsEnrollmented(Long userId, Long courseId, boolean isEnrollmented);

}
