package com.e104.reciplay.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;


/**
 * QChapter is a Querydsl query type for Chapter
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QChapter extends EntityPathBase<Chapter> {

    private static final long serialVersionUID = 1190272370L;

    public static final QChapter chapter = new QChapter("chapter");

    public final NumberPath<Long> id = createNumber("id", Long.class);

    public final NumberPath<Long> lectureId = createNumber("lectureId", Long.class);

    public final NumberPath<Integer> sequence = createNumber("sequence", Integer.class);

    public final StringPath title = createString("title");

    public QChapter(String variable) {
        super(Chapter.class, forVariable(variable));
    }

    public QChapter(Path<? extends Chapter> path) {
        super(path.getType(), path.getMetadata());
    }

    public QChapter(PathMetadata metadata) {
        super(Chapter.class, metadata);
    }

}

