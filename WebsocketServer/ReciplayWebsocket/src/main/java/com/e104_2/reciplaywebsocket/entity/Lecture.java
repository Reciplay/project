package com.e104_2.reciplaywebsocket.entity;

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

    @Column(name = "resource_url")
    private String resourceUrl;

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
}
