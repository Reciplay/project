package com.e104.reciplay.user.review.service;

import com.e104.reciplay.entity.Review;
import com.e104.reciplay.user.review.dto.response.ReviewSummary;

import org.springframework.data.domain.Pageable;
import java.util.List;

public interface ReviewQueryService {
    Review queryReviewById(Long reviewId);

    Integer countReviewsByCourseId(Long courseId);

    Double avgStarsByCourseId(Long courseId);

    Boolean isReviewed(Long courseId, Long userId);

    List<ReviewSummary> queryReviewSummaries(Long courseId, Pageable pageable);
}
