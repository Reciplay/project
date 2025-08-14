package com.e104.reciplay.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;


/**
 * QCourseHistory is a Querydsl query type for CourseHistory
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QCourseHistory extends EntityPathBase<CourseHistory> {

    private static final long serialVersionUID = -1532442274L;

    public static final QCourseHistory courseHistory = new QCourseHistory("courseHistory");

    public final NumberPath<Long> courseId = createNumber("courseId", Long.class);

    public final DateTimePath<java.time.LocalDateTime> enrolledAt = createDateTime("enrolledAt", java.time.LocalDateTime.class);

    public final NumberPath<Long> id = createNumber("id", Long.class);

    public final BooleanPath isEnrolled = createBoolean("isEnrolled");

    public final NumberPath<Long> userId = createNumber("userId", Long.class);

    public QCourseHistory(String variable) {
        super(CourseHistory.class, forVariable(variable));
    }

    public QCourseHistory(Path<? extends CourseHistory> path) {
        super(path.getType(), path.getMetadata());
    }

    public QCourseHistory(PathMetadata metadata) {
        super(CourseHistory.class, metadata);
    }

}

