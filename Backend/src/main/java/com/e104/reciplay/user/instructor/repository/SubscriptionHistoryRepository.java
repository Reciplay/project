package com.e104.reciplay.user.instructor.repository;

import com.e104.reciplay.entity.SubscriptionHistory;
import com.e104.reciplay.user.instructor.repository.custom.CustomSubscriptionHistoryRepository;
import org.springframework.data.jpa.repository.JpaRepository;


public interface SubscriptionHistoryRepository extends JpaRepository<SubscriptionHistory, Long>, CustomSubscriptionHistoryRepository {
    SubscriptionHistory findByInstructorId(Long instructorId);
}
