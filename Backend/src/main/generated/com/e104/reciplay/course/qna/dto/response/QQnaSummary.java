package com.e104.reciplay.course.qna.dto.response;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.ConstructorExpression;
import javax.annotation.processing.Generated;

/**
 * com.e104.reciplay.course.qna.dto.response.QQnaSummary is a Querydsl Projection type for QnaSummary
 */
@Generated("com.querydsl.codegen.DefaultProjectionSerializer")
public class QQnaSummary extends ConstructorExpression<QnaSummary> {

    private static final long serialVersionUID = -1045344909L;

    public QQnaSummary(com.querydsl.core.types.Expression<? extends com.e104.reciplay.entity.Question> question, com.querydsl.core.types.Expression<String> userNickname) {
        super(QnaSummary.class, new Class<?>[]{com.e104.reciplay.entity.Question.class, String.class}, question, userNickname);
    }

}

