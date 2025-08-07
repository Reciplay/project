package com.e104.reciplay.repository.custom.impl;

import com.e104.reciplay.entity.QReview;
import com.e104.reciplay.repository.custom.CustomReviewRepository;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class CustomReviewRepositoryImpl implements CustomReviewRepository {
    private final JPAQueryFactory queryFactory;
    private final QReview review = QReview.review;

    @Override
    public Double avgStarsByCourseId(Long courseId) {
        Double result = queryFactory
                .select(review.stars.avg())
                .from(review)
                .where(review.courseId.eq(courseId))
                .fetchOne();

        return result != null ? result : 0.0;
    }
}
