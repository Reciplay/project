package com.e104.reciplay.user.subscription.service;

import com.e104.reciplay.user.instructor.dto.response.TrendPoint;
import com.e104.reciplay.user.instructor.repository.SubscriptionHistoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SubscriptionHistoryQueryServiceImpl implements SubscriptionHistoryQueryService {
    private final SubscriptionHistoryRepository subscriptionHistoryRepository;
    @Override
    public Integer querySubscriberCount(Long instructorId) {
        return subscriptionHistoryRepository.findByInstructorId(instructorId).getSubscriberCount();
    }

    @Override
    public List<TrendPoint> queryTrendPoints(Long instructorId, List<LocalDate> targetDates) {
        return subscriptionHistoryRepository.findTrendPointsByInstructorIdAndDates(instructorId, targetDates);
    }
}
