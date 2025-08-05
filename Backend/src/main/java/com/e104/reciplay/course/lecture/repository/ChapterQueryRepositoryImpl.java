package com.e104.reciplay.course.lecture.repository;

import com.e104.reciplay.course.lecture.dto.response.ChapterInfo;
import com.e104.reciplay.course.lecture.dto.response.TodoInfo;
import com.e104.reciplay.entity.QChapter;
import com.e104.reciplay.entity.QTodo;
import com.querydsl.core.group.GroupBy;
import com.querydsl.core.types.Projections;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class ChapterQueryRepositoryImpl implements ChapterQueryRepository {

    private final JPAQueryFactory queryFactory;

    @Override
    public List<ChapterInfo> findChaptersWithTodosByLectureId(Long lectureId) {
        return queryFactory
                .from(QChapter.chapter)
                .leftJoin(QTodo.todo).on(QChapter.chapter.id.eq(QTodo.todo.chapterId))
                .where(QChapter.chapter.lectureId.eq(lectureId))
                .transform(
                        GroupBy.groupBy(QChapter.chapter.id).list(
                                com.querydsl.core.types.Projections.constructor(
                                        ChapterInfo.class,
                                        QChapter.chapter.sequence,
                                        QChapter.chapter.title,
                                        GroupBy.list(
                                                com.querydsl.core.types.Projections.constructor(
                                                        TodoInfo.class,
                                                        QTodo.todo.sequence,
                                                        QTodo.todo.title,
                                                        QTodo.todo.type,      // Enum → Integer 자동 변환됨
                                                        QTodo.todo.seconds
                                                )
                                        )
                                )
                        )
                );
    }
}
