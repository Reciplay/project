package com.e104.reciplay.repository.custom.impl;

import com.e104.reciplay.entity.QCourse;
import com.e104.reciplay.entity.QLecture;
import com.e104.reciplay.entity.QLectureHistory;
import com.e104.reciplay.repository.custom.CustomLectureHistoryRepository;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class CustomLectureHistoryRepositoryImpl implements CustomLectureHistoryRepository {
    private final JPAQueryFactory queryFactory;
    private final QLectureHistory h = QLectureHistory.lectureHistory;
    private final QLecture l = QLecture.lecture;
    private final QCourse c = QCourse.course;

//    @Override
//    public Long countHistoryOfCourse(Long courseId, Long userId) {
//        return queryFactory.select(h.count())
//                .from(h)
//                .join(l)
//                .on(h.lecture_id.eq(l.id))
//                .where(l.courseId.eq(courseId), h.userId.eq(userId))
//                .fetchFirst();
//    }
}
