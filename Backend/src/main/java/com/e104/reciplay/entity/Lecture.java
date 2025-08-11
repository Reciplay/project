package com.e104.reciplay.entity;

import com.e104.reciplay.course.lecture.dto.LectureControlRequest;
import com.e104.reciplay.course.lecture.dto.request.item.LectureRegisterRequest;
import com.e104.reciplay.course.lecture.dto.request.LectureRequest;
import com.e104.reciplay.course.lecture.dto.request.item.LectureUpdateRequest;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

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

    @Column(name = "is_skipped")
    private Boolean isSkipped;

    public Lecture(LectureRequest registerRequest, Long courseId) {
        LectureControlRequest request = registerRequest.getRequest();
        this.courseId = courseId;
        this.title = request.getTitle();
        this.summary = request.getSummary();
        this.sequence = request.getSequence();
        this.materials = request.getMaterials();
        this.startedAt = request.getStartedAt();
        this.endedAt = request.getEndedAt();
        this.isCompleted = false;
        this.isSkipped = false;
    }

    public void update(LectureUpdateRequest request) {
        if(!this.title.equals(request.getTitle())) this.title = request.getTitle();
        if(!this.summary.equals(request.getSummary())) this.summary = request.getSummary();
        if(!this.sequence.equals(request.getSequence())) this.sequence = request.getSequence();
        if(!this.materials.equals(request.getMaterials())) this.materials = request.getMaterials();
    }
}
