package com.e104.reciplay.course.lecture.dto;


import com.e104.reciplay.course.lecture.dto.response.Chapter;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

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
    private String startedAt;
    private String endedAt;
    private List<Chapter> chapters;

}
