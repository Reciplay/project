package com.e104.reciplay.course.lecture.dto;

import com.e104.reciplay.course.courses.dto.request.item.ChapterItem;

import java.time.LocalDateTime;
import java.util.List;

public interface LectureControlRequest {
    String getTitle();
    String getSummary();
    Integer getSequence();
    String getMaterials();
    LocalDateTime getStartedAt();
    LocalDateTime getEndedAt();
    List<ChapterItem> getChapterList();
}
