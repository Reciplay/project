package com.e104.reciplay.user.review.service;

public interface ReviewQueryService {
    Integer countReviewsByCourseId(Long courseId);

    Double avgStarsByCourseId(Long courseId);
}
