package com.e104.reciplay.repository.custom;

import com.e104.reciplay.user.review.dto.response.ReviewSummary;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface CustomReviewRepository {
    Double avgStarsByCourseId(Long courseId);
    List<ReviewSummary> summarizeCourseReviews(Long courseId, Pageable pageable);

}
