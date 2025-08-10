package com.e104.reciplay.user.instructor.service;

import com.e104.reciplay.user.instructor.repository.SubscriptionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SubscriptionQueryServiceImpl implements  SubscriptionQueryService{
    private final SubscriptionRepository subscriptionRepository;
    @Override
    public Boolean queryIsSubscription(Long userId, Long instructorId) {
        return subscriptionRepository.existsByUserIdAndInstructorId(userId, instructorId);
    }

    @Override
    public Integer countSubscriberByInstructorId(Long instructorId) {
        return subscriptionRepository.countByInstructorId(instructorId);
    }
}
