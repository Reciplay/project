package com.e104.reciplay.course.courses.dto.request;


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
public class RequestCourseInfo {
    private Long courseId; // 강좌 정보 수정을 위함

    private String title;
    private LocalDateTime enrollmentStartDate;
    private LocalDateTime enrollmentEndDate;
    private Long categoryId;
    private String summary;
    private Integer maxEnrollments;
    private String description;
    private Integer level;
    private String announcement;
    private List<String> canLearns; //이런걸 배울 수 있어요

}
