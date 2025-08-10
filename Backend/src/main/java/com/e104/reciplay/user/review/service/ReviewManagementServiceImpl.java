package com.e104.reciplay.user.review.service;

import com.e104.reciplay.common.exception.InvalidUserRoleException;
import com.e104.reciplay.course.courses.exception.CourseClosedException;
import com.e104.reciplay.entity.Like;
import com.e104.reciplay.entity.Review;
import com.e104.reciplay.livekit.service.depends.CourseQueryService;
import com.e104.reciplay.repository.LikeRepository;
import com.e104.reciplay.repository.ReviewRepository;
import com.e104.reciplay.user.lecture_history.service.PersonalStatService;
import com.e104.reciplay.user.review.dto.request.ReviewRequest;
import com.e104.reciplay.user.security.domain.User;
import com.e104.reciplay.user.security.service.UserQueryService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class ReviewManagementServiceImpl implements ReviewManagementService {
    private final ReviewRepository reviewRepository;
    private final LikeRepository likeRepository;
    private final UserQueryService userQueryService;
    private final PersonalStatService personalStatService;
    private final ReviewQueryService reviewQueryService;
    private final CourseQueryService courseQueryService;

    @Override
    @Transactional
    public void deleteReview(Long reviewId, String email) {
        User user = userQueryService.queryUserByEmail(email);
        Review review = reviewQueryService.queryReviewById(reviewId);
        if(!review.getUserId().equals(user.getId()))
            throw new InvalidUserRoleException("리뷰 작성자만 삭제할 수 있습니다.");
        if(courseQueryService.isClosedCourse(review.getCourseId()))
            throw new CourseClosedException("종료된 강좌의 리뷰는 제거할 수 없습니다.");

        likeRepository.deleteByReviewId(reviewId);
        reviewRepository.deleteById(reviewId);
    }

    @Override
    @Transactional
    public void likeReview(Long reviewId, String email) {
        User user = userQueryService.queryUserByEmail(email);

        Like like = likeRepository.findByReviewIdAndUserId(reviewId, user.getId()).orElse(null);
        if(like != null ){
            throw new IllegalArgumentException("이미 좋아요 한 수강평 입니다.");
        }

        like = new Like(null, user.getId(), reviewId);
        likeRepository.save(like);
        Review review = reviewQueryService.queryReviewById(reviewId);
        review.setLikeCount(review.getLikeCount()+1);
    }

    @Override
    public void createReview(ReviewRequest request, String email) {
        User user = userQueryService.queryUserByEmail(email);
        Double progress = personalStatService.calcCourseProgress(request.getCourseId(), email);
        if(progress < 0.5) throw new IllegalArgumentException("진행률이 50% 미만인 강의는 수강평을 남길 수 없습니다.");
        if(reviewRepository.existsByCourseIdAndUserId(request.getCourseId(), user.getId())) {
            throw new IllegalArgumentException("이미 작성한 리뷰가 존재합니다.");
        }

        reviewRepository.save(new Review(null, user.getId(), request.getCourseId(), request.getStars(), request.getReview(), null, 0));
    }

    @Override
    @Transactional
    public void unlikeReview(Long reviewId, String email) {
        User user = userQueryService.queryUserByEmail(email);

        Like like = likeRepository.findByReviewIdAndUserId(reviewId, user.getId()).orElse(null);
        if(like == null ){
            throw new IllegalArgumentException("좋아요하지 않은 수강평 입니다.");
        }

        likeRepository.delete(like);
        Review review = reviewQueryService.queryReviewById(reviewId);
        review.setLikeCount(review.getLikeCount()-1);
    }
}
