package com.e104.reciplay.user.review.service;

import com.e104.reciplay.user.review.dto.request.ReviewRequest;

public interface ReviewManagementService {
    void deleteReview(Long reviewId, String email);
    void likeReview(Long reviewId, String email);
    void createReview(ReviewRequest request, String email);
    void unlikeReview(Long reviewId, String email);
}
