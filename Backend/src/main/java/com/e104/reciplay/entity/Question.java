package com.e104.reciplay.entity;

import com.e104.reciplay.course.qna.dto.request.QnaRegisterRequest;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity(name = "questions")
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
@EntityListeners(AuditingEntityListener.class)
public class Question {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "course_id")
    private Long courseId;

    @Column(name = "user_id")
    private Long userId;

    private String title;

    @Column(name = "question_content")
    private String questionContent;

    @Column(name = "answer_content")
    private String answerContent;

    @Column(name = "question_at")
    @CreatedDate
    private LocalDateTime questionAt;

    @Column(name = "answer_at")
    private LocalDateTime answerAt;

    @Column(name = "question_updated_at")
    private LocalDateTime questionUpdatedAt;

    @Column(name = "answer_updated_at")
    private LocalDateTime answerUpdatedAt;

    public Question(QnaRegisterRequest request, Long userId) {
        this.courseId = request.getCourseId();
        this.title = request.getTitle();
        this.questionContent = request.getQuestionContent();
        this.questionUpdatedAt = LocalDateTime.now();
        this.userId = userId;
    }
}
