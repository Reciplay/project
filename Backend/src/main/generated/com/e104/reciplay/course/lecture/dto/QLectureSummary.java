package com.e104.reciplay.course.lecture.dto;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.ConstructorExpression;
import javax.annotation.processing.Generated;

/**
 * com.e104.reciplay.course.lecture.dto.QLectureSummary is a Querydsl Projection type for LectureSummary
 */
@Generated("com.querydsl.codegen.DefaultProjectionSerializer")
public class QLectureSummary extends ConstructorExpression<LectureSummary> {

    private static final long serialVersionUID = -2087398870L;

    public QLectureSummary(com.querydsl.core.types.Expression<Integer> sequence, com.querydsl.core.types.Expression<Long> lectureId, com.querydsl.core.types.Expression<String> title, com.querydsl.core.types.Expression<java.time.LocalDateTime> startedAt, com.querydsl.core.types.Expression<Boolean> isSkipped) {
        super(LectureSummary.class, new Class<?>[]{int.class, long.class, String.class, java.time.LocalDateTime.class, boolean.class}, sequence, lectureId, title, startedAt, isSkipped);
    }

}

