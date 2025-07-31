package com.e104_2.reciplaywebsocket.entity;

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

    @Column(name = "question_at")
    @CreatedDate
    private LocalDateTime questionAt;

    @Column(name = "answer_at")
    private LocalDateTime answerAt;

    @Column(name = "question_updated_at")
    private LocalDateTime questionUpdatedAt;

    @Column(name = "answer_updated_at")
    private LocalDateTime answerUpdatedAt;
}
