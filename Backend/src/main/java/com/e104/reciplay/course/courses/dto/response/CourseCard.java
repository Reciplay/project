package com.e104.reciplay.course.courses.dto.response;

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
public class CourseCard {

    private String specialBannerUrl;
    private String thumbnailUrl;
    private Integer viewerCount;

    private String title;
    private Long courseId;
    private String category;
    private Double averageReviewScore;
    private Boolean isLive;
    private LocalDate courseStartDate;
    private LocalDate courseEndData;
    private Integer level;
    private String summary;
    private String description;
    private List<String> canLearns; //이런걸 배울 수 있어요

    private Boolean isEnrolled; //수강 여부
    private String announcement;

    private Long instructorId;
    private String instructorName;





}
