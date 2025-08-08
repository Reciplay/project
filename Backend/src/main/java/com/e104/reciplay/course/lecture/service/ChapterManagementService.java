package com.e104.reciplay.course.lecture.service;

import com.e104.reciplay.course.courses.dto.request.item.ChapterItem;
import com.e104.reciplay.course.lecture.dto.response.request.LectureRegisterRequest;

import java.util.List;

public interface ChapterManagementService {
    void registChaptersWithTodos(List<LectureRegisterRequest> requests, List<Long> lectureIds);
}
