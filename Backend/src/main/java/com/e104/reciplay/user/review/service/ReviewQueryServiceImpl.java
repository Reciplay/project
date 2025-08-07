package com.e104.reciplay.user.review.service;

import com.e104.reciplay.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ReviewQueryServiceImpl implements  ReviewQueryService{
    private final ReviewRepository reviewRepository;
    @Override
    public Integer countReviewsByCourseId(Long courseId) {
        return reviewRepository.countByCourseId(courseId);
    }

    @Override
    public Double avgStarsByCourseId(Long courseId) {
        return reviewRepository.avgStarsByCourseId(courseId);
    }
}
