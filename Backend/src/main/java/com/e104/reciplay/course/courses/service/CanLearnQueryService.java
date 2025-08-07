package com.e104.reciplay.course.courses.service;

import java.util.List;

public interface CanLearnQueryService {
    List<String> queryContentsByCourseId(Long courseId);
}
