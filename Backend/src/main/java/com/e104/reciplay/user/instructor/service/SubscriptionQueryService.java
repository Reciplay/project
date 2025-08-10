package com.e104.reciplay.user.instructor.service;

public interface SubscriptionQueryService {
    Boolean queryIsSubscription(Long userId, Long instructorId);

    Integer countSubscriberByInstructorId(Long instructorId);
}
