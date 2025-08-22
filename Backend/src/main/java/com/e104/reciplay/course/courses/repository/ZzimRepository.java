package com.e104.reciplay.course.courses.repository;

import com.e104.reciplay.entity.Zzim;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ZzimRepository extends JpaRepository<Zzim, Long> {
    Boolean existsByCourseIdAndUserId(Long courseId, Long userId);
    Optional<Zzim> findByCourseIdAndUserId(Long courseId, Long userId);
}
