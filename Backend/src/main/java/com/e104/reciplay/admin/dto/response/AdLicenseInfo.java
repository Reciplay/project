package com.e104.reciplay.admin.dto.response;

import com.e104.reciplay.entity.InstructorLicense;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AdLicenseInfo {
    private String name;
    private String institution;
    private LocalDate acquisitionDate;
    private String grade;

    public AdLicenseInfo(InstructorLicense license){
        this.institution = license.getInstitution();
        this.acquisitionDate = license.getAcquisitionDate();
        this.grade = license.getGrade();
    }
}
