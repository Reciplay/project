package com.e104.reciplay.course.courses.repository.custom;


import com.e104.reciplay.course.courses.dto.response.CourseDetail;
import com.e104.reciplay.entity.QCourse;
import com.e104.reciplay.entity.QLecture;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class CustomCourseQueryRepositoryImpl implements  CustomCourseQueryRepository{
    private final JPAQueryFactory query;

    QCourse course = QCourse.course;
    QLecture lecture = QLecture.lecture;

    @Override
    public List<CourseDetail> findCoursesByInstructorId(Long instructorId) {
        // Course 목록 조회
//        List<Course> courses = query.selectFrom(course)
//                .where(course.instructorId.eq(instructorId))
//                .fetch();
//
//        List<Long> courseIds = courses.stream().map(Course::getId).toList();
//
//        // 강의 조회
//        List<Lecture> lectures = query.selectFrom(lecture)
//                .where(lecture.courseId.in(courseIds))
//                .orderBy(lecture.sequence.asc())
//                .fetch();
//
//        // Map<courseId, List<LectureSummary>> 생성
//        Map<Long, List<LectureSummary>> lectureMap = lectures.stream()
//                .collect(Collectors.groupingBy(
//                        Lecture::getCourseId,
//                        Collectors.mapping(l -> LectureSummary.builder()
//                                        .lectureId(l.getId())
//                                        .sequence(l.getSequence())
//                                        .title(l.getTitle())
//                                        .startedAt(l.getStartedAt())
//                                        .isSkipped(l.getIsSkipped())
//                                        .build(),
//                                Collectors.toList())
//                ));

        // Course -> CourseDetail 매핑
//        return courses.stream().map(c -> CourseDetail.builder()
//                .courseId(c.getId())
//                .instructorId(c.getInstructorId())
//                .title(c.getTitle())
//                .courseStartDate(c.getCourseStartDate())
//                .courseEndDate(c.getCourseEndDate())
//                .enrollmentStartDate(c.getEnrollmentStartDate())
//                .enrollmentEndDate(c.getEnrollmentEndDate())
//                .category("TODO: categoryName") // 수정 필요
//                .summary(c.getSummary())
//                .description(c.getDescription())
//                .level(c.getLevel())
//                .maxEnrollments(c.getMaxEnrollments())
//                .isEnrollment(null)
//                .isZzim(null)
//                .isLive(c.getIsLive())
//                .announcement(c.getAnnouncement())
//                .isReviwed(null)
//                .reviewCount(0) // 수정 필요
//                .averageReviewScore(0.0) // 수정 필요
//                .canLearns(List.of("Spring", "JPA")) // 상의 후 수정 필요
//                .courseCoverImage(c.getCoverImageUrl()) // 수정 필요
//                .courseImageMap(Map.of(1, c.getCoverImageUrl())) // 수정 필요
//                .lectureSummaryList(lectureMap.getOrDefault(c.getId(), List.of()))
//                .build()
//        ).toList();
//        return courses.stream().map(CourseDetail::new).toList();
        return null;
    }

    @Override
    public CourseDetail findCourseByCourseId(Long courseId) {
//        // 1. 강좌(course) 단건 조회
//        Course c = query.selectFrom(course)
//                .where(course.id.eq(courseId))
//                .fetchOne();
//
//        if (c == null) return null;
//
//        // 2. 해당 강좌의 모든 강의 조회
//        List<Lecture> lectureList = query.selectFrom(lecture)
//                .where(lecture.courseId.eq(courseId))
//                .orderBy(lecture.sequence.asc())
//                .fetch();
//
//        // 3. Lecture -> LectureSummary로 변환
//        List<LectureSummary> lectureSummaries = lectureList.stream().map(l -> LectureSummary.builder()
//                .lectureId(l.getId())
//                .sequence(l.getSequence())
//                .title(l.getTitle())
//                .startedAt(l.getStartedAt())
//                .isSkipped(l.getIsSkipped())
//                .build()
//        ).toList();

        // 4. Course -> CourseDetail 조립
//        return CourseDetail.builder()
//                .courseId(c.getId())
//                .title(c.getTitle())
//                .instructorId(c.getInstructorId())
//                .category(String.valueOf(c.getCategoryId())) // 필요 시 변환 로직
//                .courseStartDate(c.getCourseStartDate())
//                .courseEndDate(c.getCourseEndDate())
//                .enrollmentStartDate(c.getEnrollmentStartDate())
//                .enrollmentEndDate(c.getEnrollmentEndDate())
//                .summary(c.getSummary())
//                .description(c.getDescription())
//                .maxEnrollments(c.getMaxEnrollments())
//                .isEnrollment(true)  // 수정 필요
//                .isZzim(false)       // 수정 필요
//                .isLive(c.getIsLive())
//                .announcement(c.getAnnouncement())
//                .isReviwed(false)    // 수정 필요
//                .reviewCount(0)      // 수정 필요
//                .averageReviewScore(0.0) // 수정 필요
//                .canLearns(List.of("Spring", "QueryDSL")) // 회의 필요
//                .courseCoverImage(c.getCoverImageUrl()) // 수정 필요
//                .courseImageMap(Map.of(1, c.getCoverImageUrl())) // 수정 필요
//                .level(c.getLevel())
//                .lectureSummaryList(lectureSummaries)
//                .build();
        return null;
    }
}

