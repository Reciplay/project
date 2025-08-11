package com.e104.reciplay.repository.custom.impl;

import com.e104.reciplay.course.qna.dto.response.QnaSummary;
import com.e104.reciplay.entity.QCourse;
import com.e104.reciplay.entity.QQuestion;
import com.e104.reciplay.repository.custom.CustomQuestionRepository;
import com.e104.reciplay.user.instructor.dto.response.item.InstructorQuestion;
import com.e104.reciplay.user.security.domain.QUser;
import com.querydsl.core.types.Projections;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class CustomQuestionRepositoryImpl implements CustomQuestionRepository {
    private final JPAQueryFactory queryFactory;
    private final QQuestion q = QQuestion.question;
    private final QUser u = QUser.user;
    private final QCourse c = QCourse.course;

    @Override
    public List<QnaSummary> findQuestionSummaryWithQuestioner(Long courseId, Pageable pageable) {
        return queryFactory
                .select(Projections.constructor(QnaSummary.class, q, u.nickname))
                .from(q).join(u).on(q.userId.eq(u.id))
                .where(q.courseId.eq(courseId))
                .orderBy(q.questionAt.desc(), q.title.asc(), q.id.asc())
                .offset(pageable.getOffset()).limit(pageable.getPageSize())
                .fetch();
    }

    @Override
    public List<InstructorQuestion> findQuestionsByInstructorId(Long instructorId) {
        return queryFactory
                .select(Projections.constructor(
                        InstructorQuestion.class,
                        q.id,                 // Long id
                        q.title,              // String title
                        q.questionContent,    // String content
                        q.questionAt,         // LocalDateTime questionAt
                        c.title,              // String courseName
                        q.courseId            // Long courseId
                ))
                .from(q)
                .join(c).on(q.courseId.eq(c.id))
                .where(
                        c.instructorId.eq(instructorId),
                        q.answerContent.isNotNull(),
                        q.answerAt.isNotNull()
                )
                .orderBy(q.questionAt.asc(), q.id.asc()) // 오래된 질문부터 정렬
                .fetch();
    }
}
