package com.e104.reciplay.course.courses.service;

import com.e104.reciplay.course.courses.dto.response.CourseCard;
import com.e104.reciplay.course.courses.dto.response.CourseDetail;

import java.util.List;

public interface CoursesQueryService {
    List<CourseCard> queryCourseCardListByInstructorId(Long instructorId);

    CourseDetail queryCourseByCourseId(Long courseId);
    List<CourseDetail> queryCoursesByInstructorId(Long instructorId);
}
