package com.e104.reciplay.course.lecture.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class LectureSummary {
    private Integer sequence;
    private Long lectureId;
    private String title;
    private String startedAt;
    private Boolean isSkipped;
}
