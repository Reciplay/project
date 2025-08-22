package com.e104.reciplay.user.instructor.repository;

import com.e104.reciplay.entity.Subscription;
import com.e104.reciplay.user.instructor.repository.custom.CustomSubscriptionRepository;
import org.springframework.data.jpa.repository.JpaRepository;


public interface SubscriptionRepository extends JpaRepository<Subscription, Long>, CustomSubscriptionRepository {
    Boolean existsByUserIdAndInstructorId(Long userId,Long  instructorId);

    Integer countByInstructorId(Long instructorId);
}
