package com.e104.reciplay.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;


/**
 * QLiveRoom is a Querydsl query type for LiveRoom
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QLiveRoom extends EntityPathBase<LiveRoom> {

    private static final long serialVersionUID = -1773284510L;

    public static final QLiveRoom liveRoom = new QLiveRoom("liveRoom");

    public final NumberPath<Long> id = createNumber("id", Long.class);

    public final NumberPath<Long> lectureId = createNumber("lectureId", Long.class);

    public final StringPath roomname = createString("roomname");

    public QLiveRoom(String variable) {
        super(LiveRoom.class, forVariable(variable));
    }

    public QLiveRoom(Path<? extends LiveRoom> path) {
        super(path.getType(), path.getMetadata());
    }

    public QLiveRoom(PathMetadata metadata) {
        super(LiveRoom.class, metadata);
    }

}

