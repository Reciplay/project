package com.e104.reciplay.repository.custom.impl;

import com.e104.reciplay.entity.QCourse;
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
    private final QCourse course = QCourse.course;

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
    }
}
