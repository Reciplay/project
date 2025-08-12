package com.e104.reciplay.user.subscription.service;

import com.e104.reciplay.entity.SubscriptionHistory;
import com.e104.reciplay.user.instructor.repository.SubscriptionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SubscriptionHistoryQueryServiceImpl implements SubscriptionHistoryQueryService{
    private final SubscriptionRepository subscriptionRepository;
    @Override
    public Integer querySubscriberCount(Long instructorId) {
        SubscriptionHistory subscriptionHistory = subscriptionRepository.findByInstructorId(instructorId);
        return subscriptionHistory.getSubscriberCount();
    }
}
