package com.e104.reciplay.course.lecture.dto.response;

import com.querydsl.core.annotations.QueryProjection;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@Builder
public class LectureSummary {
    private Integer sequence;
    private Long lectureId;
    private String title;
    private LocalDateTime startedAt;
    private Boolean isSkipped;

    @QueryProjection
    public LectureSummary(Integer sequence, Long lectureId, String title, LocalDateTime startedAt, Boolean isSkipped) {
        this.sequence = sequence;
        this.lectureId = lectureId;
        this.title = title;
        this.startedAt = startedAt;
        this.isSkipped = isSkipped;
    }
}
