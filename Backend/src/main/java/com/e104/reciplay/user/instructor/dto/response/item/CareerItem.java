package com.e104.reciplay.user.instructor.dto.response.item;


import com.e104.reciplay.entity.Career;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CareerItem {
    private Long careerId;
    private String companyName;
    private String position;
    private String jobDescription;
    private LocalDate startDate;
    private LocalDate endDate;

    public CareerItem(Career career){
        this.companyName = career.getCompanyName();
        this.position = career.getPosition();
        this.jobDescription = career.getJobDescription();
        this.startDate = career.getStartDate();
        this.endDate = career.getEndDate();
    }
}
