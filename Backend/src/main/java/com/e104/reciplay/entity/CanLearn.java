package com.e104.reciplay.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity(name = "can_learn")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CanLearn {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "course_id")
    private Long courseId;

    private String content;
}
