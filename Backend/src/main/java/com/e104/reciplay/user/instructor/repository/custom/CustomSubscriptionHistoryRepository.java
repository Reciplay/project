package com.e104.reciplay.user.instructor.repository.custom;

import com.e104.reciplay.user.instructor.dto.response.TrendPoint;

import java.time.LocalDate;
import java.util.List;

public interface CustomSubscriptionHistoryRepository {
    List<TrendPoint> findTrendPointsByInstructorIdAndDates(Long instructorId,List<LocalDate> targetDates);
}
