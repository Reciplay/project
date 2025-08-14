package com.e104.reciplay.course.lecture.dto;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.ConstructorExpression;
import javax.annotation.processing.Generated;

/**
 * com.e104.reciplay.course.lecture.dto.QChapterInfo is a Querydsl Projection type for ChapterInfo
 */
@Generated("com.querydsl.codegen.DefaultProjectionSerializer")
public class QChapterInfo extends ConstructorExpression<ChapterInfo> {

    private static final long serialVersionUID = 313087993L;

    public QChapterInfo(com.querydsl.core.types.Expression<Integer> sequence, com.querydsl.core.types.Expression<String> title, com.querydsl.core.types.Expression<? extends java.util.List<TodoInfo>> todos) {
        super(ChapterInfo.class, new Class<?>[]{int.class, String.class, java.util.List.class}, sequence, title, todos);
    }

}

