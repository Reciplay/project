package com.e104.reciplay.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;


/**
 * QTodo is a Querydsl query type for Todo
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QTodo extends EntityPathBase<Todo> {

    private static final long serialVersionUID = -38805183L;

    public static final QTodo todo = new QTodo("todo");

    public final NumberPath<Long> chapterId = createNumber("chapterId", Long.class);

    public final NumberPath<Long> id = createNumber("id", Long.class);

    public final NumberPath<Integer> seconds = createNumber("seconds", Integer.class);

    public final NumberPath<Integer> sequence = createNumber("sequence", Integer.class);

    public final StringPath title = createString("title");

    public final EnumPath<com.e104.reciplay.common.types.TodoType> type = createEnum("type", com.e104.reciplay.common.types.TodoType.class);

    public QTodo(String variable) {
        super(Todo.class, forVariable(variable));
    }

    public QTodo(Path<? extends Todo> path) {
        super(path.getType(), path.getMetadata());
    }

    public QTodo(PathMetadata metadata) {
        super(Todo.class, metadata);
    }

}

