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
        QChapter chapter = QChapter.chapter;
        QTodo todo = QTodo.todo;

        List<ChapterInfo> result = queryFactory
                .selectFrom(chapter)
                .leftJoin(todo).on(todo.chapterId.eq(chapter.id))
                .where(chapter.lectureId.eq(lectureId))
                .transform(
                        GroupBy.groupBy(chapter.id).list(
                                Projections.constructor(ChapterInfo.class,
                                        chapter.sequence,
                                        chapter.title,
                                        GroupBy.list(Projections.constructor(TodoInfo.class,
                                                todo.sequence,
                                                todo.title,
                                                todo.type,
                                                todo.seconds
                                        ))
                                )
                        )
                );
        return result;
    }
}
