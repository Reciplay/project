package com.e104.reciplay.course.lecture.dto.request;

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
public class LectureUpdateInfo {
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
