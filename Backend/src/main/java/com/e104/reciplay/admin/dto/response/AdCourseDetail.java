package com.e104.reciplay.admin.dto.response;

import com.e104.reciplay.entity.Course;
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
public class AdCourseDetail {
    private Long courseId;
    private String title;
    private LocalDate courseStartDate;
    private LocalDate courseEndDate;
    private Long instructorId;
    private LocalDateTime enrollmentStartDate;
    private LocalDateTime enrollmentEndDate;
    private String summary;
    private Integer maxEnrollments;
    private Integer level;
    private String announcement;
    private String description;

    // 따로 가져올 데이터
    private String category;
    private List<String> canLearns; //이런걸 배울 수 있어요
    private List<AdLectureDetail> lectureDetails;
    private String instructorName;

    public AdCourseDetail(Course c) {
        this.courseId = c.getId();
        this.title = c.getTitle();
        this.courseStartDate = c.getCourseStartDate();
        this.courseEndDate = c.getCourseEndDate();
        this.instructorId = c.getInstructorId();
        this.enrollmentStartDate = c.getEnrollmentStartDate();
        this.enrollmentEndDate = c.getEnrollmentEndDate();
        this.summary = c.getSummary();
        this.maxEnrollments = c.getMaxEnrollments();
        this.level = c.getLevel();
        this.announcement = c.getAnnouncement();
        this.description = c.getDescription();
    }

}
