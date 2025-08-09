package com.e104.reciplay.course.courses.repository.custom;

import com.e104.reciplay.entity.Course;

import java.util.List;

public interface CustomCourseRepository {
    List<Course> findSoonCourseByInstructorId(Long instructorId);

    List<Course> findOngoingCourseByInstructorId(Long instructorId);

    List<Course> findEndedCourseByInstructorId(Long instructorId);
}
