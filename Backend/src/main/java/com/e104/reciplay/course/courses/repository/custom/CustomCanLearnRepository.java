package com.e104.reciplay.course.courses.repository.custom;

import java.util.List;

public interface CustomCanLearnRepository {
    List<String> findContentsByCourseId(Long courseId);
}
