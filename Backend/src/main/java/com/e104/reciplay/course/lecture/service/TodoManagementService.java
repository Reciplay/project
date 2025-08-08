package com.e104.reciplay.course.lecture.service;

import com.e104.reciplay.course.lecture.dto.response.request.LectureRegisterRequest;

import java.util.List;
import java.util.Queue;

public interface TodoManagementService {
    void registerTodoItems(List<LectureRegisterRequest> requests, Queue<Long> chapterIds);
}
