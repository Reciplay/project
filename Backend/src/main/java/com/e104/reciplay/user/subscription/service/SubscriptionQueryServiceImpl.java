package com.e104.reciplay.user.subscription.service;

import com.e104.reciplay.entity.Subscription;
import com.e104.reciplay.repository.SubSubscriptionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@RequiredArgsConstructor
@Service
@Slf4j
public class SubscriptionQueryServiceImpl implements SubscriptionQueryService {
    private final SubSubscriptionRepository subscriptionRepository;

    @Override
    public List<Subscription> querySubscriptionsByUserId(Long userId) {
        return subscriptionRepository.findByUserId(userId);
    }

    @Override
    public Long countSubscribers(Long instructorId) {
        return subscriptionRepository.countByInstructorId(instructorId);
    }

    @Override
    public boolean isSubscribedInstructor(Long instructorId, Long userId) {
        return subscriptionRepository.findByInstructorIdAndUserId(instructorId, userId).orElse(null) != null;
    }
}
