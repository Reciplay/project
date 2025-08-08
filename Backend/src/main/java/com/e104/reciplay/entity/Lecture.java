package com.e104.reciplay.entity;

import com.e104.reciplay.course.courses.dto.request.LectureRequest;
import com.e104.reciplay.course.lecture.dto.response.request.LectureRegisterRequest;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import software.amazon.awssdk.services.s3.endpoints.internal.Value;

import java.time.LocalDateTime;

@Entity(name = "lectures")
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
public class Lecture {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "course_id")
    private Long courseId;

    private Integer sequence;

    private String title;

    private String summary;

    private String materials; // 문비물

    @Column(name = "started_at")
    private LocalDateTime startedAt;

    @Column(name = "ended_at")
    private LocalDateTime endedAt;

    @Column(name = "is_completed")
    private Boolean isCompleted;

    @Column(name = "resource_name")
    private String resourceName;

    @Column(name = "is_skipped")
    private Boolean isSkipped;

    public Lecture(LectureRegisterRequest registerRequest, Long courseId) {
        LectureRequest request = registerRequest.getLectureRequest();
        this.courseId = courseId;
        this.title = request.getTitle();
        this.summary = request.getSummary();
        this.sequence = request.getSequence();
        this.materials = request.getMaterials();
        this.startedAt = request.getStartedAt();
        this.endedAt = request.getEndedAt();
        this.isCompleted = false;
        this.isSkipped = false;

        this.resourceName = registerRequest.getMaterial().getOriginalFilename();
    }
}
