package com.e104.reciplay.user.subscription.service;

import com.e104.reciplay.user.instructor.dto.response.TrendPoint;

import java.time.LocalDate;
import java.util.List;

public interface SubscriptionHistoryQueryService {
    Integer querySubscriberCount(Long instructorId);

    List<TrendPoint> queryTrendPoints(Long instructorId, List<LocalDate> targetDates);
}
