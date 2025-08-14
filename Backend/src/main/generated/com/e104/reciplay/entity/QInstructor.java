package com.e104.reciplay.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;


/**
 * QInstructor is a Querydsl query type for Instructor
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QInstructor extends EntityPathBase<Instructor> {

    private static final long serialVersionUID = 1533321560L;

    public static final QInstructor instructor = new QInstructor("instructor");

    public final StringPath address = createString("address");

    public final NumberPath<Long> id = createNumber("id", Long.class);

    public final StringPath introduction = createString("introduction");

    public final BooleanPath isApproved = createBoolean("isApproved");

    public final StringPath phoneNumber = createString("phoneNumber");

    public final DateTimePath<java.time.LocalDateTime> registeredAt = createDateTime("registeredAt", java.time.LocalDateTime.class);

    public final NumberPath<Long> userId = createNumber("userId", Long.class);

    public QInstructor(String variable) {
        super(Instructor.class, forVariable(variable));
    }

    public QInstructor(Path<? extends Instructor> path) {
        super(path.getType(), path.getMetadata());
    }

    public QInstructor(PathMetadata metadata) {
        super(Instructor.class, metadata);
    }

}

