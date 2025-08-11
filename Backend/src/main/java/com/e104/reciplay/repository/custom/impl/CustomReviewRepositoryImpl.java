package com.e104.reciplay.repository.custom.impl;

import com.e104.reciplay.entity.QCourse;
import com.e104.reciplay.entity.QReview;
import com.e104.reciplay.repository.custom.CustomReviewRepository;
import com.e104.reciplay.user.review.dto.response.ReviewSummary;
import com.e104.reciplay.user.security.domain.QUser;
import com.querydsl.core.types.Projections;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import org.springframework.data.domain.Pageable;


import java.util.List;

@Repository
@RequiredArgsConstructor
public class CustomReviewRepositoryImpl implements CustomReviewRepository {
    private final JPAQueryFactory queryFactory;
    private final QReview review = QReview.review;
<<<<<<< HEAD
    private final QCourse course = QCourse.course;
=======
    private final QUser user = QUser.user;
>>>>>>> dev

    @Override
    public Double avgStarsByCourseId(Long courseId) {
        Double result = queryFactory
                .select(review.stars.avg())
                .from(review)
                .where(review.courseId.eq(courseId))
                .fetchOne();

        return result != null ? result : 0.0;
    }

    @Override
<<<<<<< HEAD
    public Double avgInstructorStarsByInstructorId(Long instructorId) {
        // 강사의 모든 "승인된 & 삭제되지 않은" 강좌에 대한 리뷰 평균
        Double result = queryFactory
                .select(review.stars.avg())
                .from(review)
                .join(course).on(course.id.eq(review.courseId))
                .where(
                        course.instructorId.eq(instructorId),
                        course.isDeleted.isFalse(),
                        course.isApproved.isTrue()
                )
                .fetchOne();

        return (result != null) ? result : 0.0;
    }

    @Override
    public Integer countInstructorTotalReviewByInstructorId(Long instructorId) {
        Long count = queryFactory
                .select(review.count())
                .from(review)
                .join(course).on(course.id.eq(review.courseId))
                .where(
                        course.instructorId.eq(instructorId),
                        course.isDeleted.isFalse(),
                        course.isApproved.isTrue()
                )
                .fetchOne();

        return (count != null) ? count.intValue() : 0;
=======
    public List<ReviewSummary> summarizeCourseReviews(Long courseId, Pageable pageable) {
        return queryFactory.select(
                        Projections.constructor(ReviewSummary.class, review.id, user.nickname, user.id, review.content, review.createdAt, review.likeCount)
                ).from(review).join(user).on(review.userId.eq(user.id))
                .where(review.courseId.eq(courseId))
                .orderBy(review.likeCount.desc())
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetch();
>>>>>>> dev
    }
}
