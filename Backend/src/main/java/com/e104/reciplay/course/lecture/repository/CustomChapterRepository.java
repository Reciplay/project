package com.e104.reciplay.course.lecture.repository;

import com.e104.reciplay.course.lecture.dto.response.ChapterInfo;

import java.util.List;

public interface CustomChapterRepository {
    List<ChapterInfo> findChaptersWithTodosByLectureId(Long lectureId);
}
