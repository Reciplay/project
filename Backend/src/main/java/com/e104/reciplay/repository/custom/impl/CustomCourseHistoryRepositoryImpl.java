package com.e104.reciplay.repository.custom.impl;

import com.e104.reciplay.entity.QCourse;
import com.e104.reciplay.entity.QCourseHistory;
import com.e104.reciplay.repository.custom.CustomCourseHistoryRepository;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor

public class CustomCourseHistoryRepositoryImpl implements CustomCourseHistoryRepository {
    private final JPAQueryFactory query;

    private final QCourse course = QCourse.course;
    private final QCourseHistory courseHistory = QCourseHistory.courseHistory;

    @Override
    public Integer countInstructorTotalStudentsByInstructorId(Long instructorId) {
        Long total = query
                .select(courseHistory.userId.countDistinct())
                .from(courseHistory)
                .join(course).on(course.id.eq(courseHistory.courseId))  // FK(Long) 기반 ON 조인
                .where(
                        course.instructorId.eq(instructorId) // .and(courseHistory.isEnrolled.isTrue()) // “현재 수강 중만” 집계하려면 사용
                )
                .fetchOne();

        // fetchOne()이 null일 수 있으니 0 처리 + Integer로 변환
        return total == null ? 0 : Math.toIntExact(total);
    }
}
