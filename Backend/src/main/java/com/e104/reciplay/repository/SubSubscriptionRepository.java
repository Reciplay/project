package com.e104.reciplay.repository;

import com.e104.reciplay.entity.Subscription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SubSubscriptionRepository extends JpaRepository<Subscription, Long> {
    List<Subscription> findByUserId(Long userId);
    Integer countByInstructorId(Long instructorId);
    Optional<Subscription> findByInstructorIdAndUserId(Long instructorId, Long userId);
    void deleteByInstructorIdAndUserId(Long instructorId, Long userId);
}
