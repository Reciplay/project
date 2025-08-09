package com.e104.reciplay.course.courses.repository.custom;

import com.e104.reciplay.entity.Course;
import com.e104.reciplay.entity.QCourse;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Repository
@RequiredArgsConstructor
public class CustomCourseRepositoryImpl implements CustomCourseRepository{
    private final JPAQueryFactory queryFactory;

    private final QCourse course = QCourse.course;

    //instructorId가 일치하고,현재 시각이 enrollmentStartDate ~ enrollmentEndDate 사이(포함)인 강좌들
    @Override
    public List<Course> findSoonCourseByInstructorId(Long instructorId) {
        LocalDateTime now = LocalDateTime.now();
        return queryFactory
                .selectFrom(course)
                .where(
                        course.instructorId.eq(instructorId),
                        // QueryDSL between은 양끝 포함(inclusive)입니다.
                        course.enrollmentStartDate.loe(now),
                        course.enrollmentEndDate.goe(now)
                )
                .fetch();
    }


    //instructorId가 일치하고, 오늘 날짜가 courseStartDate ~ courseEndDate 사이(포함)인 강좌들
    @Override
    public List<Course> findOngoingCourseByInstructorId(Long instructorId) {
        LocalDate today = LocalDate.now();
        return queryFactory
                .selectFrom(course)
                .where(
                        course.instructorId.eq(instructorId),
                        course.courseStartDate.loe(today),
                        course.courseEndDate.goe(today)
                )
                .fetch();
    }

    //instructorId가 일치하고,오늘 날짜가 courseEndDate '이후'(미포함)인 강좌들 → courseEndDate < today

    @Override
    public List<Course> findEndedCourseByInstructorId(Long instructorId) {
        LocalDate today = LocalDate.now();
        return queryFactory
                .selectFrom(course)
                .where(
                        course.instructorId.eq(instructorId),
                        course.courseEndDate.lt(today)
                )
                .fetch();
    }
}
