package com.e104.reciplay.user.instructor.dto.response.item;


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
    private Long id;
    private String companyName;
    private String position;
    private String jobDescription;
    private LocalDate startDate;
    private LocalDate endDate;
}
