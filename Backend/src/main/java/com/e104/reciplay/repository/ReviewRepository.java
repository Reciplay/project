package com.e104.reciplay.repository;

import com.e104.reciplay.entity.Review;
import com.e104.reciplay.repository.custom.CustomReviewRepository;
import org.springframework.data.jpa.repository.JpaRepository;


public interface ReviewRepository extends JpaRepository<Review, Long>, CustomReviewRepository {
    Integer countByCourseId(Long courseId);

    Double avgStarsByCourseId(Long courseId);

    Boolean existsByCourseIdAndUserId(Long courseId,Long userId);

}
