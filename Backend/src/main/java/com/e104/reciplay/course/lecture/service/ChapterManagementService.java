package com.e104.reciplay.course.lecture.service;

import com.e104.reciplay.course.lecture.dto.request.LectureRequest;

import java.util.List;
import java.util.Map;

public interface ChapterManagementService {
    void registChaptersWithTodos(List<LectureRequest> requests, List<Long> lectureIds);
    void updateChapterWithTodos(Map<Long, LectureRequest> requestMap);
}
