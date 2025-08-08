package com.e104.reciplay.repository;

import com.e104.reciplay.course.courses.repository.custom.CustomCourseRepository;
import com.e104.reciplay.entity.Course;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;


public interface CourseRepository extends JpaRepository<Course, Long>, CustomCourseRepository {
    List<Course> findAllByInstructorId(Long instructorId);
//    Optional<Course> findById(Long Id);
}
