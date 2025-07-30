package com.e104.reciplay.entity;

import ch.qos.logback.core.rolling.helper.IntegerTokenConverter;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import software.amazon.awssdk.services.s3.endpoints.internal.Value;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity(name = "courses")
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
public class Course {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "instructor_id")
    private Long instructorId;

    @Column(name = "category_id")
    private Long categoryId;

    private String title;

    @Column(name = "course_start_date")
    private LocalDate courseStartDate;

    @Column(name = "course_end_date")
    private LocalDate courseEndDate;

    private String description;

    private String summary;

    private Integer level;


    @Column(name = "max_enrollments")
    private Integer maxEnrollments;

    @Column(name = "is_approved")
    private Boolean isApproved;

    @Column(name = "current_enrollments")
    private Integer currentEnrollments;

    @Column(name = "enrollment_start_date")
    private LocalDateTime enrollmentStartDate;

    @Column(name = "enrollment_end_date")
    private LocalDateTime enrollmentEndDate;

    @Column(name = "is_live")
    private Boolean isLive;

    @Column(name = "is_deleted")
    private Boolean isDeleted;

    @Column(name = "registered_at")
    private LocalDateTime registeredAt;

    @Column(name = "cover_image_url")
    private String coverImageUrl;

    private String announcement;
}
