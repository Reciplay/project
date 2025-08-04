package com.e104.reciplay.course.courses.dto.request;


import com.e104.reciplay.common.dto.FileCondition;
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
public class CourseRegisterInfo {

    private String title;
    private List<FileCondition> thumbnailConditions;
    private FileCondition coverimageCondition;
    private LocalDateTime enrollmentStartDate;
    private LocalDateTime enrollmentEndDate;
    private String category;
    private String summary;
    private Integer maxEnrollments;
    private String description;
    private Integer level;
    private String announcement;
    private List<String> canLearns; //이런걸 배울 수 있어요
    private List<ChapterInfo> chapters;
}
