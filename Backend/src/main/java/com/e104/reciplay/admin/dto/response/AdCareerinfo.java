package com.e104.reciplay.admin.dto.response;

import com.e104.reciplay.entity.Career;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AdCareerinfo {
    private String companyName;
    private String position;
    private String jobDescription;
    private LocalDate startDate;
    private LocalDate endDate;

    public AdCareerinfo(Career c){
        this.companyName = c.getCompanyName();
        this.position = c.getPosition();
        this.jobDescription = c.getJobDescription();
        this.startDate = c.getStartDate();
        this.endDate = c.getEndDate();
    }
}
