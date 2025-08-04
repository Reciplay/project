package com.e104.reciplay.course.courses.service;

import com.e104.reciplay.course.courses.dto.request.CourseRegisterInfo;

public interface CourseCommandService {
    void creatCourseByInstructorId(Long instructorId, CourseRegisterInfo courseRegisterInfo);
}
