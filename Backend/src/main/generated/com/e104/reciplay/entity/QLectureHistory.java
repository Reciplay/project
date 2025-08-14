package com.e104.reciplay.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;


/**
 * QLectureHistory is a Querydsl query type for LectureHistory
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QLectureHistory extends EntityPathBase<LectureHistory> {

    private static final long serialVersionUID = -2127650703L;

    public static final QLectureHistory lectureHistory = new QLectureHistory("lectureHistory");

    public final DateTimePath<java.time.LocalDateTime> attendedAt = createDateTime("attendedAt", java.time.LocalDateTime.class);

    public final NumberPath<Long> id = createNumber("id", Long.class);

    public final NumberPath<Long> lectureId = createNumber("lectureId", Long.class);

    public final NumberPath<Long> userId = createNumber("userId", Long.class);

    public QLectureHistory(String variable) {
        super(LectureHistory.class, forVariable(variable));
    }

    public QLectureHistory(Path<? extends LectureHistory> path) {
        super(path.getType(), path.getMetadata());
    }

    public QLectureHistory(PathMetadata metadata) {
        super(LectureHistory.class, metadata);
    }

}

