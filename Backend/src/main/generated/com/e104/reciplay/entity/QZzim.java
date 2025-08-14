package com.e104.reciplay.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;


/**
 * QZzim is a Querydsl query type for Zzim
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QZzim extends EntityPathBase<Zzim> {

    private static final long serialVersionUID = -38615713L;

    public static final QZzim zzim = new QZzim("zzim");

    public final NumberPath<Long> courseId = createNumber("courseId", Long.class);

    public final NumberPath<Long> id = createNumber("id", Long.class);

    public final NumberPath<Long> userId = createNumber("userId", Long.class);

    public QZzim(String variable) {
        super(Zzim.class, forVariable(variable));
    }

    public QZzim(Path<? extends Zzim> path) {
        super(path.getType(), path.getMetadata());
    }

    public QZzim(PathMetadata metadata) {
        super(Zzim.class, metadata);
    }

}

