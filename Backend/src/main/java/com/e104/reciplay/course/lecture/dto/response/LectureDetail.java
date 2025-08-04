package com.e104.reciplay.course.lecture.dto.response;


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

}
