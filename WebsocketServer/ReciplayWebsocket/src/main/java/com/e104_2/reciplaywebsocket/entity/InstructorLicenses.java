package com.e104_2.reciplaywebsocket.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity(name = "instructor_licenses")
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
public class InstructorLicenses {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "instructor_id")
    private Long instructorId;

    @Column(name = "license_id")
    private Long licenseId;

    private String institution;

    @Column(name = "acquisition_date")
    private LocalDate acquisitionDate;

    private String grade;
}
