package com.e104.reciplay.user.instructor.repository.custom;

import com.e104.reciplay.entity.QSubscription;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class CustomSubscriptionRepositoryImpl implements CustomSubscriptionRepository{
    private final JPAQueryFactory queryFactory;
    private final QSubscription subscription = QSubscription.subscription;

    @Override
    public Integer countInstructorSubscriberByInstrcutorId(Long instructorId) {
        Long count = queryFactory
                .select(subscription.count())
                .from(subscription)
                .where(subscription.instructorId.eq(instructorId))
                .fetchOne();

        return (count != null) ? count.intValue() : 0;
    }
}
