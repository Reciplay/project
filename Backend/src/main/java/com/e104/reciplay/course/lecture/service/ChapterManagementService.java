package com.e104.reciplay.course.lecture.service;

import com.e104.reciplay.course.courses.dto.request.item.ChapterItem;

public interface ChapterManagementService {
    void registChaptersWithTodos(ChapterItem chapterItem, Long lectureId);
}
