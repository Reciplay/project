package com.e104.reciplay.user.instructor.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class TrendPoint {
    private LocalDate t; // 날짜
    private long subscribers; // 해당 날짜의 구독자수
}
