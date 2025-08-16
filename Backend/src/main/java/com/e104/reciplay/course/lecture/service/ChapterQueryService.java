package com.e104.reciplay.course.lecture.service;

import com.e104.reciplay.entity.Chapter;

import java.util.List;

public interface ChapterQueryService {
    List<Chapter> queryChaptersByLectureId(Long lectureId);
}
