package com.e104.reciplay.admin.dto.response;

import com.e104.reciplay.course.lecture.dto.response.ChapterInfo;
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
public class AdLectureDetail {
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
