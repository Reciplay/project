package com.e104.reciplay.entity;

import com.e104.reciplay.user.instructor.dto.response.item.LicenseItem;
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
public class InstructorLicense {
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

    public InstructorLicense(LicenseItem item, Long instructorId){
        this.instructorId = instructorId;
        this.licenseId = item.getLicneseId();
        this.institution = item.getInstitution();
        this.acquisitionDate = item.getAcquisitionDate();
        this.grade = item.getGrade();
    }
}
