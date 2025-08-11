package com.e104.reciplay.user.instructor.dto.response.item;

import com.e104.reciplay.entity.InstructorLicense;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LicenseItem {
    private Long licneseId;
    private String licenseName;
    private String institution;
    private LocalDate acquisitionDate;
    private String grade;

    public LicenseItem(InstructorLicense license){
        this.licneseId = license.getLicenseId();
        this.institution = license.getInstitution();
        this.acquisitionDate = license.getAcquisitionDate();
        this.grade = license.getGrade();
    }
}
