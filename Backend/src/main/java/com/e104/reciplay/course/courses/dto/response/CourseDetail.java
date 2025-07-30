package com.e104.reciplay.course.courses.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CourseDetail {
    // 강좌 커버 이미지 추가해야 댐
    // 썸네일 이미지들 필요함

    private String courseName;
    private LocalDate courseStartDate;
    private LocalDate courseEndDate;
    private Long instructorId;
    private LocalDate enrollmentStartDate;
    private LocalDate enrollmentEndDate;
    private String category;
    private Integer reviewCount; // 총 리뷰 수
    private Double averageReviewScore; // 평균 별점
    private String summary;
    private Integer maxEnrollments;
    private Boolean isEnrollment;
    private String description;
    private Integer level;
    private Boolean isZzim;
    private Boolean isLive;
    private String announcement;
    private Boolean isReviwed; // 해당 사용자가 해당 강좌에 리뷰를 작성하였는지



}
