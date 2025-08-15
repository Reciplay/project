package com.e104.reciplay.course.lecture.dto.request.item;

import com.e104.reciplay.course.courses.dto.request.item.ChapterItem;
import com.e104.reciplay.course.lecture.dto.LectureControlRequest;
import jakarta.persistence.criteria.CriteriaBuilder;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class LoughLectureInfo implements LectureControlRequest {
    private Integer sequence;
    private String title;
    private String materials;
    private String summary;
    private List<String> chapters;

    @Override
    public LocalDateTime getStartedAt() {
        return null;
    }

    @Override
    public LocalDateTime getEndedAt() {
        return null;
    }

    @Override
    public List<ChapterItem> getChapterList() {
        return null;
    }
}
