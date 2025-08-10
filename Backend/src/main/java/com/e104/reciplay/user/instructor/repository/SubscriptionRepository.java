package com.e104.reciplay.user.instructor.repository;

import com.e104.reciplay.entity.Subscription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SubscriptionRepository extends JpaRepository<Subscription, Long> {
    Boolean existsByUserIdAndInstructorId(Long userId,Long  instructorId);

    Integer countByInstructorId(Long instructorId);
}
