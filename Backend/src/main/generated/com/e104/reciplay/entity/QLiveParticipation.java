package com.e104.reciplay.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;


/**
 * QLiveParticipation is a Querydsl query type for LiveParticipation
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QLiveParticipation extends EntityPathBase<LiveParticipation> {

    private static final long serialVersionUID = -740285798L;

    public static final QLiveParticipation liveParticipation = new QLiveParticipation("liveParticipation");

    public final StringPath email = createString("email");

    public final NumberPath<Long> id = createNumber("id", Long.class);

    public final NumberPath<Long> liveRoomId = createNumber("liveRoomId", Long.class);

    public QLiveParticipation(String variable) {
        super(LiveParticipation.class, forVariable(variable));
    }

    public QLiveParticipation(Path<? extends LiveParticipation> path) {
        super(path.getType(), path.getMetadata());
    }

    public QLiveParticipation(PathMetadata metadata) {
        super(LiveParticipation.class, metadata);
    }

}

