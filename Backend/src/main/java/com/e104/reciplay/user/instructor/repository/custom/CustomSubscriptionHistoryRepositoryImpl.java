package com.e104.reciplay.user.instructor.repository.custom;

import com.e104.reciplay.entity.QSubscriptionHistory;
import com.e104.reciplay.user.instructor.dto.response.TrendPoint;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Repository
@RequiredArgsConstructor
public class CustomSubscriptionHistoryRepositoryImpl implements CustomSubscriptionHistoryRepository {
    private final JPAQueryFactory queryFactory;
    private final QSubscriptionHistory history = QSubscriptionHistory.subscriptionHistory;
    @Override
    public List<TrendPoint> findTrendPointsByInstructorIdAndDates(Long instructorId, List<LocalDate> targetDates) {
        return targetDates.stream()
                .map(date -> {
                    Integer count = queryFactory
                            .select(history.subscriberCount)
                            .from(history)
                            .where(history.instructorId.eq(instructorId)
                                    .and(history.date.eq(date)))
                            .fetchOne();

                    return new TrendPoint(date, count != null ? count : 0);
                })
                .collect(Collectors.toList());
    }
}
