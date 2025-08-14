package com.e104.reciplay.user.review.dto.response;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.ConstructorExpression;
import javax.annotation.processing.Generated;

/**
 * com.e104.reciplay.user.review.dto.response.QReviewSummary is a Querydsl Projection type for ReviewSummary
 */
@Generated("com.querydsl.codegen.DefaultProjectionSerializer")
public class QReviewSummary extends ConstructorExpression<ReviewSummary> {

    private static final long serialVersionUID = 1264486995L;

    public QReviewSummary(com.querydsl.core.types.Expression<Long> reviewId, com.querydsl.core.types.Expression<String> nickname, com.querydsl.core.types.Expression<Long> userId, com.querydsl.core.types.Expression<String> content, com.querydsl.core.types.Expression<java.time.LocalDateTime> createdAt, com.querydsl.core.types.Expression<Integer> likeCount) {
        super(ReviewSummary.class, new Class<?>[]{long.class, String.class, long.class, String.class, java.time.LocalDateTime.class, int.class}, reviewId, nickname, userId, content, createdAt, likeCount);
    }

}

