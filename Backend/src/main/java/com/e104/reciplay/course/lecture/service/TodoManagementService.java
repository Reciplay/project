package com.e104.reciplay.course.lecture.service;

import com.e104.reciplay.course.courses.dto.request.item.ChapterItem;
import com.e104.reciplay.course.lecture.dto.request.LectureRequest;

import java.util.List;
import java.util.Map;
import java.util.Queue;

public interface TodoManagementService {
    void registerTodoItems(List<LectureRequest> requests, Queue<Long> chapterIds);
    void deleteAllTodos(Long chapterId);

    void updateTodos(Map<Long, ChapterItem> chapterItemMap);
}
