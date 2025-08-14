package com.e104.reciplay.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;


/**
 * QQuestion is a Querydsl query type for Question
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QQuestion extends EntityPathBase<Question> {

    private static final long serialVersionUID = -61816991L;

    public static final QQuestion question = new QQuestion("question");

    public final DateTimePath<java.time.LocalDateTime> answerAt = createDateTime("answerAt", java.time.LocalDateTime.class);

    public final StringPath answerContent = createString("answerContent");

    public final DateTimePath<java.time.LocalDateTime> answerUpdatedAt = createDateTime("answerUpdatedAt", java.time.LocalDateTime.class);

    public final NumberPath<Long> courseId = createNumber("courseId", Long.class);

    public final NumberPath<Long> id = createNumber("id", Long.class);

    public final DateTimePath<java.time.LocalDateTime> questionAt = createDateTime("questionAt", java.time.LocalDateTime.class);

    public final StringPath questionContent = createString("questionContent");

    public final DateTimePath<java.time.LocalDateTime> questionUpdatedAt = createDateTime("questionUpdatedAt", java.time.LocalDateTime.class);

    public final StringPath title = createString("title");

    public final NumberPath<Long> userId = createNumber("userId", Long.class);

    public QQuestion(String variable) {
        super(Question.class, forVariable(variable));
    }

    public QQuestion(Path<? extends Question> path) {
        super(path.getType(), path.getMetadata());
    }

    public QQuestion(PathMetadata metadata) {
        super(Question.class, metadata);
    }

}

