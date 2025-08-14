package com.e104.reciplay.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;


/**
 * QLevel is a Querydsl query type for Level
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QLevel extends EntityPathBase<Level> {

    private static final long serialVersionUID = -1210629655L;

    public static final QLevel level1 = new QLevel("level1");

    public final NumberPath<Long> categoryId = createNumber("categoryId", Long.class);

    public final NumberPath<Long> id = createNumber("id", Long.class);

    public final NumberPath<Integer> level = createNumber("level", Integer.class);

    public final NumberPath<Long> userId = createNumber("userId", Long.class);

    public QLevel(String variable) {
        super(Level.class, forVariable(variable));
    }

    public QLevel(Path<? extends Level> path) {
        super(path.getType(), path.getMetadata());
    }

    public QLevel(PathMetadata metadata) {
        super(Level.class, metadata);
    }

}

