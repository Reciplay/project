package com.e104.reciplay.livekit.service.depends;

import com.e104.reciplay.course.courses.dto.response.CourseDetail;
import com.e104.reciplay.entity.Course;

import java.util.List;

public interface CourseQueryService {
    Course queryCourseById(Long id);

    List<CourseDetail> queryCourseDetailsByInstructorId(Long instructorId, String courseStatus);

    CourseDetail queryCourseDetailByCourseId(Long courseId, Long userId);

    Boolean isClosedCourse(Long courseId);

    Boolean isInstructorOf(Long userId, Long courseId);

    Boolean isStartedCourse(Long courseId);

    Boolean isInEnrollmentTerm(Long courseId);

    Boolean isFullyEnrolledCourse(Long courseId);
}
