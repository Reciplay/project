package com.e104.reciplay.course.lecture.repository;

import com.e104.reciplay.course.lecture.dto.LectureDetail;
import com.e104.reciplay.course.lecture.dto.response.LectureSummary;
import com.e104.reciplay.course.lecture.dto.response.QLectureSummary;
import com.e104.reciplay.course.lecture.dto.QLectureDetail;
import com.e104.reciplay.entity.QLecture;
import com.querydsl.core.types.dsl.Expressions;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
@RequiredArgsConstructor
public class LectureQueryRepositoryImpl implements  LectureQueryRepository{
    private final JPAQueryFactory queryFactory;
    @Override
    public List<LectureSummary> findLectureSummariesByCourseId(Long courseId) {
        QLecture lecture = QLecture.lecture;
        return queryFactory
                .select(new QLectureSummary(
                        lecture.sequence,
                        lecture.id,
                        lecture.title,
                        lecture.startedAt,
                        lecture.isSkipped
                ))
                .from(lecture)
                .where(lecture.courseId.eq(courseId))
                .fetch();
    }
    @Override
    public LectureDetail findLectureDetailById(Long lectureId) {
        QLecture lecture = QLecture.lecture;

        return queryFactory
                .select(new QLectureDetail(
                        lecture.id,
                        lecture.sequence,
                        lecture.title,
                        lecture.summary,
                        lecture.materials,
                        lecture.isSkipped,
                        lecture.resourceName,
                        Expressions.dateTemplate(LocalDate.class, "DATE({0})", lecture.startedAt),
                        Expressions.dateTemplate(LocalDate.class, "DATE({0})", lecture.endedAt)
                ))
                .from(lecture)
                .where(lecture.id.eq(lectureId))
                .fetchOne();
    }
    @Override
    public List<LectureDetail> findLectureDetailsByCourseId(Long courseId) {
        QLecture lecture = QLecture.lecture;

        return queryFactory
                .select(new QLectureDetail(   // QueryProjection 사용 시
                        lecture.id,
                        lecture.sequence,
                        lecture.title,
                        lecture.summary,
                        lecture.materials,
                        lecture.isSkipped,
                        lecture.resourceName,
                        Expressions.dateTemplate(LocalDate.class, "DATE({0})", lecture.startedAt),
                        Expressions.dateTemplate(LocalDate.class, "DATE({0})", lecture.endedAt)
                ))
                .from(lecture)
                .where(lecture.courseId.eq(courseId))
                .fetch();
    }
}
