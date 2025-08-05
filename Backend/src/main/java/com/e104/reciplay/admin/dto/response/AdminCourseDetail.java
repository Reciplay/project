package com.e104.reciplay.admin.dto.response;

import com.e104.reciplay.course.lecture.dto.response.LectureDetail;
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
public class AdminCourseDetail {
    private Long courseId;
    private String courseName;
    private LocalDate courseStartDate;
    private LocalDate courseEndDate;
    private Long instructorId;
    private LocalDate enrollmentStartDate;
    private LocalDate enrollmentEndDate;
    private String category;
    private String summary;
    private Integer maxEnrollments;
    private Boolean isEnrollment;
    private Integer level;
    private String announcement;
    private String description;
    private List<LectureDetail> lectureDetails;

}
