package com.e104.reciplay.course.courses.repository.custom;

import com.e104.reciplay.course.courses.dto.response.CourseDetail;

import java.util.List;

public interface CustomCourseQueryRepository {
    List<CourseDetail> findCoursesByInstructorId(Long instructorId);
    CourseDetail findCourseByCourseId(Long courseId);
}
