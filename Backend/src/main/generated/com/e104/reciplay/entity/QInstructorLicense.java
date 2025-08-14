package com.e104.reciplay.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;


/**
 * QInstructorLicense is a Querydsl query type for InstructorLicense
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QInstructorLicense extends EntityPathBase<InstructorLicense> {

    private static final long serialVersionUID = -1947940919L;

    public static final QInstructorLicense instructorLicense = new QInstructorLicense("instructorLicense");

    public final DatePath<java.time.LocalDate> acquisitionDate = createDate("acquisitionDate", java.time.LocalDate.class);

    public final StringPath grade = createString("grade");

    public final NumberPath<Long> id = createNumber("id", Long.class);

    public final StringPath institution = createString("institution");

    public final NumberPath<Long> instructorId = createNumber("instructorId", Long.class);

    public final NumberPath<Long> licenseId = createNumber("licenseId", Long.class);

    public QInstructorLicense(String variable) {
        super(InstructorLicense.class, forVariable(variable));
    }

    public QInstructorLicense(Path<? extends InstructorLicense> path) {
        super(path.getType(), path.getMetadata());
    }

    public QInstructorLicense(PathMetadata metadata) {
        super(InstructorLicense.class, metadata);
    }

}

