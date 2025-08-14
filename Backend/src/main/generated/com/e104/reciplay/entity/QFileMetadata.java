package com.e104.reciplay.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;


/**
 * QFileMetadata is a Querydsl query type for FileMetadata
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QFileMetadata extends EntityPathBase<FileMetadata> {

    private static final long serialVersionUID = -2127370554L;

    public static final QFileMetadata fileMetadata = new QFileMetadata("fileMetadata");

    public final EnumPath<com.e104.reciplay.s3.enums.FileCategory> category = createEnum("category", com.e104.reciplay.s3.enums.FileCategory.class);

    public final NumberPath<Long> id = createNumber("id", Long.class);

    public final StringPath name = createString("name");

    public final NumberPath<Long> relatedId = createNumber("relatedId", Long.class);

    public final EnumPath<com.e104.reciplay.s3.enums.RelatedType> relatedType = createEnum("relatedType", com.e104.reciplay.s3.enums.RelatedType.class);

    public final StringPath resourceType = createString("resourceType");

    public final NumberPath<Integer> sequence = createNumber("sequence", Integer.class);

    public final DateTimePath<java.time.LocalDateTime> uploadedAt = createDateTime("uploadedAt", java.time.LocalDateTime.class);

    public QFileMetadata(String variable) {
        super(FileMetadata.class, forVariable(variable));
    }

    public QFileMetadata(Path<? extends FileMetadata> path) {
        super(path.getType(), path.getMetadata());
    }

    public QFileMetadata(PathMetadata metadata) {
        super(FileMetadata.class, metadata);
    }

}

