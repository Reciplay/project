package com.e104.reciplay.user.review.service;

import com.e104.reciplay.entity.FileMetadata;
import com.e104.reciplay.entity.Review;
import com.e104.reciplay.repository.ReviewRepository;
import com.e104.reciplay.s3.service.FileMetadataQueryService;
import com.e104.reciplay.s3.service.S3Service;
import com.e104.reciplay.user.review.dto.response.ReviewSummary;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import org.springframework.data.domain.Pageable;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class ReviewQueryServiceImpl implements  ReviewQueryService{
    private final ReviewRepository reviewRepository;
    private final S3Service s3Service;
    private final FileMetadataQueryService fileMetadataQueryService;

    @Override
    public Review queryReviewById(Long reviewId) {
        return reviewRepository.findById(reviewId).orElseThrow(() -> new IllegalArgumentException("존재하지 않는 수강평입니다."));
    }

    @Override
    public Integer countReviewsByCourseId(Long courseId) {
        return reviewRepository.countByCourseId(courseId);
    }

    @Override
    public Double avgStarsByCourseId(Long courseId) {
        return reviewRepository.avgStarsByCourseId(courseId);
    }

    @Override
    public Boolean isReviewed(Long courseId, Long userId) {
        return reviewRepository.existsByCourseIdAndUserId(courseId, userId);
    }

    @Override
    public List<ReviewSummary> queryReviewSummaries(Long courseId, Pageable pageable) {
        List<ReviewSummary> summaries = reviewRepository.summarizeCourseReviews(courseId, pageable);
        for(ReviewSummary summary : summaries) {
            try {
                FileMetadata metadata = fileMetadataQueryService.queryUserProfilePhoto(summary.getUserId());
                summary.setProfileImage(s3Service.getResponseFileInfo(metadata).getPresignedUrl());
            } catch (Exception e) {
                log.debug("프로필 이미지가 없는 회원입니다.");
            }
        }

        return summaries;
    }
}
