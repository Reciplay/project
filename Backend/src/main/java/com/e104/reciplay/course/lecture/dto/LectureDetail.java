package com.e104.reciplay.course.lecture.dto;


import com.e104.reciplay.course.lecture.dto.response.ChapterInfo;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class LectureDetail {
    //강의 정보 URL
    private Long lectureId;
    private Integer sequence;
    private String name;
    private String summary;
    private String materials;
    private Boolean isSkipped;
    private String resourceName;
    private LocalDate startedAt;
    private LocalDate endedAt;
    private List<ChapterInfo> chapters;

}
