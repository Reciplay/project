package com.e104.reciplay.livekit.service.depends;

import com.e104.reciplay.course.lecture.dto.response.response.CourseTerm;

public interface CourseManagementService {
    void activateLiveState(Long courseId);
    void setCourseTerm(CourseTerm term, Long courseId);
}
