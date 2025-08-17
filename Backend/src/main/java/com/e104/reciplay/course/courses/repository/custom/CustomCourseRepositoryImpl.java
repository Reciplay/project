package com.e104.reciplay.course.courses.repository.custom;

import com.e104.reciplay.admin.dto.response.AdCourseSummary;
import com.e104.reciplay.entity.*;
import com.e104.reciplay.user.security.domain.QUser;
import com.querydsl.core.types.Order;
import com.querydsl.core.types.OrderSpecifier;
import com.querydsl.core.types.Projections;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.JPAExpressions;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class CustomCourseRepositoryImpl implements CustomCourseRepository{
    private final JPAQueryFactory queryFactory;

    private final LocalDateTime now = LocalDateTime.now();

    private final QSpecialCourse specialCourse = QSpecialCourse.specialCourse;
    private final QCourse course = QCourse.course;
    private final QCourseHistory courseHistory= QCourseHistory.courseHistory;
    private final QInstructor instructor = QInstructor.instructor;
    private final QZzim zzim = QZzim.zzim;

    private final QUser user = QUser.user;

    //instructorId가 일치하고,현재 시각이 enrollmentStartDate ~ enrollmentEndDate 사이(포함)인 강좌들
    @Override
    public List<Course> findSoonCourseByInstructorId(Long instructorId) {
        LocalDateTime now = LocalDateTime.now();
        return queryFactory
                .selectFrom(course)
                .where(
                        course.instructorId.eq(instructorId),
                        course.isApproved.isTrue(),
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
                        course.isApproved.isTrue(),
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
                        course.isApproved.isTrue(),
                        course.courseEndDate.lt(today)
                )
                .fetch();
    }

    @Override
    public Page<Course> findSpecialCoursesPage(Pageable pageable) {
        List<Course> results = queryFactory
                .selectFrom(course)
                .join(specialCourse).on(specialCourse.courseId.eq(course.id))
                .where(course.isApproved.isTrue()) // 승인된 강좌만
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .orderBy(orderBy(pageable.getSort(), course))
                .fetch();

        Long countResult = queryFactory
                .select(course.count())
                .from(course)
                .join(specialCourse).on(specialCourse.courseId.eq(course.id))
                .where(course.isApproved.isTrue())
                .fetchOne();

        long total = Optional.ofNullable(countResult).orElse(0L);
        return new PageImpl<>(results, pageable, total);
    }

    @Override
    public Page<Course> findSoonCoursesPage(Pageable pageable) {
        List<Course> content = queryFactory
                .selectFrom(course)
                .where(
                        course.isApproved.isTrue(),
                        course.enrollmentStartDate.loe(now),
                        course.enrollmentEndDate.goe(now)
                )
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .orderBy(orderBy(pageable.getSort(), course))
                .fetch();

        Long total = queryFactory
                .select(course.count())
                .from(course)
                .where(
                        course.isApproved.isTrue(),
                        course.enrollmentStartDate.loe(now),
                        course.enrollmentEndDate.goe(now)
                )
                .fetchOne();

        return new PageImpl<>(content, pageable, total == null ? 0L : total);
    }

    @Override
    public Page<Course> findsearchCoursesPage(String content, Boolean isEnrolled, Long userId, Pageable pageable) {
        // 1) 키워드: Course.title / Course.description / User.name
        BooleanExpression keywordCond = null;
        if (content != null && !content.isBlank()) {
            keywordCond = course.title.containsIgnoreCase(content)
                    .or(course.description.containsIgnoreCase(content))
                    .or(user.name.containsIgnoreCase(content));
        }

        // 2) 수강여부 조건
        BooleanExpression enrolledCond = null;
        if (userId != null && Boolean.TRUE.equals(isEnrolled)) {
            // 해당 유저가 수강한 강좌만
            enrolledCond = JPAExpressions.selectOne()
                    .from(courseHistory)
                    .where(courseHistory.courseId.eq(course.id)
                            .and(courseHistory.userId.eq(userId)))
                    .exists();
        } else if (userId != null && Boolean.FALSE.equals(isEnrolled)) {
            // 해당 유저가 수강하지 않은 강좌만
            enrolledCond = JPAExpressions.selectOne()
                    .from(courseHistory)
                    .where(courseHistory.courseId.eq(course.id)
                            .and(courseHistory.userId.eq(userId)))
                    .notExists();
        }

        // 3) 승인 조건
        BooleanExpression approvedCond = course.isApproved.isTrue(); // ✅ [추가]

        // 4) 모든 조건 결합
        BooleanExpression where = andAll(keywordCond, enrolledCond, approvedCond); // ✅ [수정: approvedCond 포함]

        // 5) 목록 쿼리: Course -> Instructor -> User
        List<Course> contentList = queryFactory
                .selectFrom(course)
                .leftJoin(instructor).on(instructor.id.eq(course.instructorId))
                .leftJoin(user).on(user.id.eq(instructor.userId))
                .where(where)
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .orderBy(orderBy(pageable.getSort(), course))
                .fetch();

        // 4) 카운트 쿼리 (null 안전)
        Long totalL = queryFactory
                .select(course.count())
                .from(course)
                .leftJoin(instructor).on(instructor.id.eq(course.instructorId))
                .leftJoin(user).on(user.id.eq(instructor.userId))
                .where(where)
                .fetchOne();
        long total = (totalL != null) ? totalL : 0L;

        return new PageImpl<>(contentList, pageable, total);
    }

    @Override
    public Page<Course> findInstructorCoursesPage(Long instructorId, Pageable pageable) {
        // course.instructorId == instructorId AND 종료일이 현재 날짜 이후 또는 같음
        BooleanExpression where = course.instructorId.eq(instructorId)
                .and(course.courseEndDate.goe(now.toLocalDate()))
                .and(course.isApproved.eq(true));

        List<Course> content = queryFactory
                .selectFrom(course)
                .where(where)
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .orderBy(orderBy(pageable.getSort(), course))
                .fetch();

        Long totalL = queryFactory
                .select(course.count())
                .from(course)
                .where(where)
                .fetchOne();

        return new PageImpl<>(content, pageable, totalL == null ? 0L : totalL);
    }
    @Override
    public Page<Course> findEnrolledCoursesPage(Long userId, Pageable pageable) {
        // 해당 userId가 수강한 강좌 + 종료일이 현재 날짜 이후 또는 같음
        BooleanExpression enrolledExists = JPAExpressions.selectOne()
                .from(courseHistory)
                .where(courseHistory.courseId.eq(course.id)
                        .and(courseHistory.userId.eq(userId)))
                .exists();



        BooleanExpression where = enrolledExists.and(course.courseEndDate.goe(now.toLocalDate()));

        List<Course> content = queryFactory
                .selectFrom(course)
                .where(where)
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .orderBy(orderBy(pageable.getSort(), course))
                .fetch();

        Long totalL = queryFactory
                .select(course.count())
                .from(course)
                .where(where)
                .fetchOne();

        return new PageImpl<>(content, pageable, totalL == null ? 0L : totalL);
    }

    @Override
    public Page<Course> findZzimCoursesPage(Long userId, Pageable pageable) {
        // 찜 목록 전체 (종료일 필터 없음)
        BooleanExpression zzimExists = JPAExpressions.selectOne()
                .from(zzim)
                .where(zzim.courseId.eq(course.id)
                        .and(zzim.userId.eq(userId)))
                .exists();

        List<Course> content = queryFactory
                .selectFrom(course)
                .where(zzimExists)
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .orderBy(orderBy(pageable.getSort(), course))
                .fetch();

        Long totalL = queryFactory
                .select(course.count())
                .from(course)
                .where(zzimExists)
                .fetchOne();

        return new PageImpl<>(content, pageable, totalL == null ? 0L : totalL);
    }


    @Override
    public Page<Course> findCompletedCoursesPage(Long userId, Pageable pageable) {
        // 해당 userId가 수강한 강좌 + 종료일이 현재 날짜 이전
        BooleanExpression enrolledExists = JPAExpressions.selectOne()
                .from(courseHistory)
                .where(courseHistory.courseId.eq(course.id)
                        .and(courseHistory.userId.eq(userId)))
                .exists();

        BooleanExpression where = enrolledExists.and(course.courseEndDate.lt(now.toLocalDate()));

        List<Course> content = queryFactory
                .selectFrom(course)
                .where(where)
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .orderBy(orderBy(pageable.getSort(), course))
                .fetch();

        Long totalL = queryFactory
                .select(course.count())
                .from(course)
                .where(where)
                .fetchOne();

        return new PageImpl<>(content, pageable, totalL == null ? 0L : totalL);
    }

    @Override
    public List<AdCourseSummary> findAdCourseSummariesByIsApprove(Boolean isApproved) {
        var query = queryFactory
                .select(Projections.constructor(
                        AdCourseSummary.class,
                        course.id,          // courseId
                        user.name,          // instructorName
                        course.title,       // title
                        course.registeredAt // registeredAt
                ))
                .from(course)
                .join(instructor).on(course.instructorId.eq(instructor.id))
                .join(user).on(instructor.userId.eq(user.id))
                .where(course.isApproved.eq(isApproved))
                // 필요 시 삭제된 코스 제외:
                // .where(course.isDeleted.isFalse())
                ;
        return query
                .orderBy(course.registeredAt.desc()) // 최신 등록순
                .fetch();
    }

    @Override
    public void updateCourseApprovalById(Long courseId) {
        queryFactory
                .update(course)
                .set(course.isApproved, true)
                .where(course.id.eq(courseId))
                .execute();
    }

    /** 여러 조건 and 결합 (null 무시) */
    private BooleanExpression andAll(BooleanExpression... parts) {
        BooleanExpression acc = null;
        for (BooleanExpression p : parts) {
            if (p == null) continue;
            acc = (acc == null) ? p : acc.and(p);
        }
        return acc;
    }

    /** 정렬 화이트리스트 매핑 */
    private OrderSpecifier<?>[] orderBy(Sort sort, QCourse c) {
        List<OrderSpecifier<?>> orders = new ArrayList<>();
        for (Sort.Order o : sort) {
            boolean asc = o.isAscending();
            switch (o.getProperty()) {
                case "courseStartDate" -> orders.add(new OrderSpecifier<>(asc ? Order.ASC : Order.DESC, c.courseStartDate));
                case "courseEndDate", "courseEndData" -> orders.add(new OrderSpecifier<>(asc ? Order.ASC : Order.DESC, c.courseEndDate));
                case "title" -> orders.add(new OrderSpecifier<>(asc ? Order.ASC : Order.DESC, c.title));
                case "id", "courseId" -> orders.add(new OrderSpecifier<>(asc ? Order.ASC : Order.DESC, c.id));
                default -> orders.add(new OrderSpecifier<>(asc ? Order.ASC : Order.DESC, c.courseStartDate));
            }
        }
        return orders.toArray(new OrderSpecifier[0]);
    }


}
