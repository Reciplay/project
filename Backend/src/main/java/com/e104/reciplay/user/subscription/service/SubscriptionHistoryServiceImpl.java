package com.e104.reciplay.user.subscription.service;

import com.e104.reciplay.user.instructor.repository.SubscriptionHistoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SubscriptionHistoryServiceImpl implements SubscriptionHistoryService{
    private final SubscriptionHistoryRepository subscriptionHistoryRepository;
    @Override
    public Integer querySubscriberCount(Long instructorId) {
        return subscriptionHistoryRepository.findByInstructorId(instructorId).getSubscriberCount();
    }
}
