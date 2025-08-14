package com.e104.reciplay.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;


/**
 * QCanLearn is a Querydsl query type for CanLearn
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QCanLearn extends EntityPathBase<CanLearn> {

    private static final long serialVersionUID = 959628239L;

    public static final QCanLearn canLearn = new QCanLearn("canLearn");

    public final StringPath content = createString("content");

    public final NumberPath<Long> courseId = createNumber("courseId", Long.class);

    public final NumberPath<Long> id = createNumber("id", Long.class);

    public QCanLearn(String variable) {
        super(CanLearn.class, forVariable(variable));
    }

    public QCanLearn(Path<? extends CanLearn> path) {
        super(path.getType(), path.getMetadata());
    }

    public QCanLearn(PathMetadata metadata) {
        super(CanLearn.class, metadata);
    }

}

