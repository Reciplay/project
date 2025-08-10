package com.e104.reciplay.repository.custom;

public interface CustomLectureHistoryRepository {
    Long countHistoryOfCourse(Long courseId, Long userId);
}
