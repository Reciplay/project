package com.e104.reciplay.admin.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Careerinfo {
    private String companyName;
    private String position;
    private String jobDescription;
    private LocalDate startDate;
    private LocalDate endDate;
}
