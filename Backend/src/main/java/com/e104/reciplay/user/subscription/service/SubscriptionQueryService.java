package com.e104.reciplay.user.subscription.service;

import com.e104.reciplay.entity.Subscription;

import java.util.List;

public interface SubscriptionQueryService {
    List<Subscription> querySubscriptionsByUserId(Long userId);
    Integer countSubscribers(Long instructorId);
    boolean isSubscribedInstructor(Long instructorId, Long userId);

}
