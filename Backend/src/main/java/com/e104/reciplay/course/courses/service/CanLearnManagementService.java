package com.e104.reciplay.course.courses.service;

import java.util.List;

public interface CanLearnManagementService {
    void createCanLearnsWithCourseId(Long courseId, List<String> canLearns);

    void deleteCanLearnsByCourseId(Long courseId);
}
