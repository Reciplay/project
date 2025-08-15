package com.e104.reciplay.user.instructor.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class TrendResponse {
    private String criteria; // "day" | "week" | "month"
    private LocalDate from;
    private LocalDate to;
    private List<TrendPoint> series;
}
