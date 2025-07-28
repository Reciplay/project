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
public class LicenseItem {
    private String licenseName;
    private String institution;
    private LocalDate acquisitionDate;
    private Integer grade;
}
