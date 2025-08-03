package com.e104.reciplay.course.courses.service;

import com.e104.reciplay.course.courses.dto.response.CourseDetail;

public interface CourseDetailQueryService {
    CourseDetail queryCourseDetailByCourseId(Long courseId);
}
