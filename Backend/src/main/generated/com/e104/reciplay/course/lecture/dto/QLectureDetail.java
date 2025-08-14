package com.e104.reciplay.course.lecture.dto;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.ConstructorExpression;
import javax.annotation.processing.Generated;

/**
 * com.e104.reciplay.course.lecture.dto.QLectureDetail is a Querydsl Projection type for LectureDetail
 */
@Generated("com.querydsl.codegen.DefaultProjectionSerializer")
public class QLectureDetail extends ConstructorExpression<LectureDetail> {

    private static final long serialVersionUID = 1982500173L;

    public QLectureDetail(com.querydsl.core.types.Expression<Long> lectureId, com.querydsl.core.types.Expression<Integer> sequence, com.querydsl.core.types.Expression<String> title, com.querydsl.core.types.Expression<String> summary, com.querydsl.core.types.Expression<String> materials, com.querydsl.core.types.Expression<Boolean> isSkipped, com.querydsl.core.types.Expression<java.time.LocalDateTime> startedAt, com.querydsl.core.types.Expression<java.time.LocalDateTime> endedAt) {
        super(LectureDetail.class, new Class<?>[]{long.class, int.class, String.class, String.class, String.class, boolean.class, java.time.LocalDateTime.class, java.time.LocalDateTime.class}, lectureId, sequence, title, summary, materials, isSkipped, startedAt, endedAt);
    }

}

