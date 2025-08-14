package com.e104.reciplay.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;


/**
 * QSpecialCourse is a Querydsl query type for SpecialCourse
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QSpecialCourse extends EntityPathBase<SpecialCourse> {

    private static final long serialVersionUID = -1156493415L;

    public static final QSpecialCourse specialCourse = new QSpecialCourse("specialCourse");

    public final NumberPath<Long> courseId = createNumber("courseId", Long.class);

    public final NumberPath<Long> id = createNumber("id", Long.class);

    public QSpecialCourse(String variable) {
        super(SpecialCourse.class, forVariable(variable));
    }

    public QSpecialCourse(Path<? extends SpecialCourse> path) {
        super(path.getType(), path.getMetadata());
    }

    public QSpecialCourse(PathMetadata metadata) {
        super(SpecialCourse.class, metadata);
    }

}

