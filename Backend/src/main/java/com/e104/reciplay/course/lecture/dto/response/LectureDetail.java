package com.e104.reciplay.course.lecture.dto.response;

import com.e104.reciplay.course.lecture.dto.response.ChapterInfo;
import com.querydsl.core.annotations.QueryProjection;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class LectureDetail {
    //강의 정보 URL
    private Long lectureId;
    private Integer sequence;
    private String title;
    private String summary;
    private String materials;
    private Boolean isSkipped;
    private String resourceName;
    private LocalDateTime startedAt;
    private LocalDateTime endedAt;
    private List<ChapterInfo> chapters;
    @QueryProjection
    public LectureDetail(Long lectureId, Integer sequence, String title, String summary,
                         String materials, Boolean isSkipped, String resourceName,
                         LocalDate startedAt, LocalDate endedAt) {
        this.lectureId = lectureId;
        this.sequence = sequence;
        this.title = title;
        this.summary = summary;
        this.materials = materials;
        this.isSkipped = isSkipped;
        this.resourceName = resourceName;
        this.startedAt = startedAt.atStartOfDay();
        this.endedAt = endedAt.atStartOfDay();
        this.chapters = null; // 따로 set 예정
    }

}
