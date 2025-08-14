package com.e104.reciplay.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;


/**
 * QCourse is a Querydsl query type for Course
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QCourse extends EntityPathBase<Course> {

    private static final long serialVersionUID = 876742230L;

    public static final QCourse course = new QCourse("course");

    public final StringPath announcement = createString("announcement");

    public final NumberPath<Long> categoryId = createNumber("categoryId", Long.class);

    public final DatePath<java.time.LocalDate> courseEndDate = createDate("courseEndDate", java.time.LocalDate.class);

    public final DatePath<java.time.LocalDate> courseStartDate = createDate("courseStartDate", java.time.LocalDate.class);

    public final NumberPath<Integer> currentEnrollments = createNumber("currentEnrollments", Integer.class);

    public final StringPath description = createString("description");

    public final DateTimePath<java.time.LocalDateTime> enrollmentEndDate = createDateTime("enrollmentEndDate", java.time.LocalDateTime.class);

    public final DateTimePath<java.time.LocalDateTime> enrollmentStartDate = createDateTime("enrollmentStartDate", java.time.LocalDateTime.class);

    public final NumberPath<Long> id = createNumber("id", Long.class);

    public final NumberPath<Long> instructorId = createNumber("instructorId", Long.class);

    public final BooleanPath isApproved = createBoolean("isApproved");

    public final BooleanPath isDeleted = createBoolean("isDeleted");

    public final BooleanPath isLive = createBoolean("isLive");

    public final NumberPath<Integer> level = createNumber("level", Integer.class);

    public final NumberPath<Integer> maxEnrollments = createNumber("maxEnrollments", Integer.class);

    public final DateTimePath<java.time.LocalDateTime> registeredAt = createDateTime("registeredAt", java.time.LocalDateTime.class);

    public final StringPath summary = createString("summary");

    public final StringPath title = createString("title");

    public QCourse(String variable) {
        super(Course.class, forVariable(variable));
    }

    public QCourse(Path<? extends Course> path) {
        super(path.getType(), path.getMetadata());
    }

    public QCourse(PathMetadata metadata) {
        super(Course.class, metadata);
    }

}

