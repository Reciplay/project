package com.e104.reciplay.course.courses.dto.response;

import com.e104.reciplay.entity.Course;
import com.e104.reciplay.s3.dto.response.ResponseFileInfo;
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
    private String title;
    private Long courseId;
    private Boolean isLive;
    private LocalDate courseStartDate;
    private LocalDate courseEndData;
    private Integer level;
    private String summary;
    private String description;
    private String announcement;

    private Integer viewerCount; // 소켓 서버 (따로 호출)

    private String category;
    private ResponseFileInfo responseFileInfo;
    private Long instructorId; // (따로 호출)
    private String instructorName; // (따로 호출)
    private Double averageReviewScore; // (따로 호출)
    private List<String> canLearns; //이런걸 배울 수 있어요 (따로 호출)
    private Boolean isEnrolled; //회원 수강 여부 (따로 호출)

    public CourseCard(Course course){
        this.title = course.getTitle();
        this.courseId = course.getId();
        this.isLive = course.getIsLive();
        this.courseStartDate = course.getCourseStartDate();
        this.courseEndData = course.getCourseEndDate();
        this.level = course.getLevel();
        this.summary = course.getSummary();
        this.description = course.getDescription();
        this.announcement =course.getAnnouncement();
    }

}
