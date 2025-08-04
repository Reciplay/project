package com.e104.reciplay.course.courses.repository;

import com.e104.reciplay.entity.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CourseCommandRepository extends JpaRepository<Course, Long> {
}
