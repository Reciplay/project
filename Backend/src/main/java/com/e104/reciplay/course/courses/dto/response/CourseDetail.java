package com.e104.reciplay.course.courses.dto.response;

import com.e104.reciplay.course.lecture.dto.response.LectureSummary;
import com.e104.reciplay.entity.Course;
import com.e104.reciplay.s3.dto.response.ResponseFileInfo;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CourseDetail {

    private List<ResponseFileInfo> thumbnailFileInfos;
    private ResponseFileInfo courseCoverFileInfo;

    private String title;
    private LocalDate courseStartDate;
    private LocalDate courseEndDate;
    private Long instructorId;
    private Long courseId;
    private LocalDateTime enrollmentStartDate;
    private LocalDateTime enrollmentEndDate;
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
    private List<String> canLearns; //이런걸 배울 수 있어요
    private List<LectureSummary> lectureSummaryList;

    public CourseDetail(Course course) {
        this.title = course.getTitle();//
        this.courseStartDate = course.getCourseStartDate();//
        this.courseEndDate = course.getCourseEndDate();//
        this.courseId = course.getId();//
        this.enrollmentStartDate = course.getEnrollmentStartDate();
        this.enrollmentEndDate = course.getEnrollmentEndDate();
        this.summary = course.getSummary();
        this.maxEnrollments = course.getMaxEnrollments();
        this.description = course.getDescription();
        this.level = course.getLevel();
        this.announcement = course.getAnnouncement();
        this.isLive = course.getIsLive();
        //this.categoryId = course.getCategoryId();

    }

}
