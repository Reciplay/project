package com.e104.reciplay.course.courses.repository;

import com.e104.reciplay.course.courses.repository.custom.CustomCanLearnRepository;
import com.e104.reciplay.entity.CanLearn;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;


public interface CanLearnRepository extends JpaRepository<CanLearn, Long>, CustomCanLearnRepository {
    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Transactional
    @Query(value = "DELETE FROM can_learn WHERE course_id = :courseId", nativeQuery = true)
    int deleteAllByCourseId(Long courseId);
}
