package com.e104.reciplay.course.courses.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CourseCard {
    // 배너 이미지 필요
    // 썸네일 이미지 필요 , 썸네일 리스트도 필요함
    // 현재 시청자 수?
    // 강좌 배너 이미지 필요

    private String title;
    private Long courseId;
    private String category;
    private Integer averageReviewScore;
    private Integer isLive;
    private String courseStartDate;
    private String courseEndData;
    private Integer level;
    private String summary;
    private List<String> canLearns;

    private Integer isEnrolled;
    private String announcement;

    private Long instructorId;
    private String instructorName;





}
