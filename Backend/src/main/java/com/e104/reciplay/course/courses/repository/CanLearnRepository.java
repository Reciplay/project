package com.e104.reciplay.course.courses.repository;

import com.e104.reciplay.course.courses.repository.custom.CustomCanLearnRepository;
import com.e104.reciplay.entity.CanLearn;
import org.springframework.data.jpa.repository.JpaRepository;


public interface CanLearnRepository extends JpaRepository<CanLearn, Long>, CustomCanLearnRepository {
    void deleteAllByCourseId(Long courseId);
}
