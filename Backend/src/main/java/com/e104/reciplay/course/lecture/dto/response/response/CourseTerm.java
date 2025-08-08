package com.e104.reciplay.course.lecture.dto.response.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CourseTerm {
    private LocalDate startDate;
    private LocalDate endDate;
}
