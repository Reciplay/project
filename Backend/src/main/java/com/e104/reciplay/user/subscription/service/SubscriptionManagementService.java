package com.e104.reciplay.user.subscription.service;

public interface SubscriptionManagementService {
    void subscribeInstructor(Long instructorId, String email);
    void cancleSubscription(Long instructorId, String email);
}
