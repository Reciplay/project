package com.e104.reciplay.course.lecture.dto.request.item;

import com.e104.reciplay.course.courses.dto.request.item.ChapterItem;
import com.e104.reciplay.course.lecture.dto.LectureControlRequest;
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
public class LectureUpdateRequest implements LectureControlRequest {
    private Long lectureId;
    private String title;
    private String summary; // 요약
    private Integer sequence; // 강의 순서
    private String materials; // 준비물
    private LocalDateTime startedAt;
    private LocalDateTime endedAt;
    private List<ChapterItem> chapterList;
}
