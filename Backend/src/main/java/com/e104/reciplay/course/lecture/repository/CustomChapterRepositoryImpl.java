package com.e104.reciplay.course.lecture.repository;

import com.e104.reciplay.course.lecture.dto.ChapterInfo;
import com.e104.reciplay.course.lecture.dto.TodoInfo;
import com.e104.reciplay.entity.QChapter;
import com.e104.reciplay.entity.QTodo;
import com.querydsl.core.group.GroupBy;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import com.querydsl.core.types.Projections;
import java.util.List;

@Repository
@RequiredArgsConstructor
public class CustomChapterRepositoryImpl implements CustomChapterRepository {

    private final JPAQueryFactory queryFactory;

    @Override
    public List<ChapterInfo> findChaptersWithTodosByLectureId(Long lectureId) {
        return queryFactory
                .from(QChapter.chapter)
                .leftJoin(QTodo.todo).on(QChapter.chapter.id.eq(QTodo.todo.chapterId))
                .where(QChapter.chapter.lectureId.eq(lectureId))
                .orderBy(QChapter.chapter.sequence.asc(), QTodo.todo.sequence.asc())
                .transform(
                        GroupBy.groupBy(QChapter.chapter.id).list(
                                Projections.constructor(
                                        ChapterInfo.class,
                                        QChapter.chapter.sequence,
                                        QChapter.chapter.title,
                                        GroupBy.list(
                                               Projections.constructor(
                                                        TodoInfo.class,
                                                        QTodo.todo.id,
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
