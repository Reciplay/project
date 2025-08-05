package com.e104.reciplay.course.courses.repository;

import com.e104.reciplay.course.courses.repository.custom.CustomCourseQueryRepository;
import com.e104.reciplay.entity.Course;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CourseQueryRepository extends JpaRepository<Course, Long>, CustomCourseQueryRepository {

}
