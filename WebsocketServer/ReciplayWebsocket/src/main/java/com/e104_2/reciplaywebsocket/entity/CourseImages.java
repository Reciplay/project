package com.e104.reciplay.entity;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity(name = "course_images")
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
public class CourseImages {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "course_id")
    private Long courseId;

    @Column(name = "image_url")
    private String imageUrl;

    private Integer sequence;
}

