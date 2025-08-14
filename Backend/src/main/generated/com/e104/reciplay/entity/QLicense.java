package com.e104.reciplay.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;


/**
 * QLicense is a Querydsl query type for License
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QLicense extends EntityPathBase<License> {

    private static final long serialVersionUID = 618014054L;

    public static final QLicense license = new QLicense("license");

    public final NumberPath<Long> id = createNumber("id", Long.class);

    public final StringPath name = createString("name");

    public QLicense(String variable) {
        super(License.class, forVariable(variable));
    }

    public QLicense(Path<? extends License> path) {
        super(path.getType(), path.getMetadata());
    }

    public QLicense(PathMetadata metadata) {
        super(License.class, metadata);
    }

}

