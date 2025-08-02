package com.e104_2.reciplaywebsocket.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity(name = "special_courses")
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
public class SpecialCourse {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "course_id")
    private Long courseId;

    @Column(name = "banner_image_url")
    private String bannerImageUrl;
}
