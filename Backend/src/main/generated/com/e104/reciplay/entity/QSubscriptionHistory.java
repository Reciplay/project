package com.e104.reciplay.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;


/**
 * QSubscriptionHistory is a Querydsl query type for SubscriptionHistory
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QSubscriptionHistory extends EntityPathBase<SubscriptionHistory> {

    private static final long serialVersionUID = -236311972L;

    public static final QSubscriptionHistory subscriptionHistory = new QSubscriptionHistory("subscriptionHistory");

    public final DatePath<java.time.LocalDate> date = createDate("date", java.time.LocalDate.class);

    public final NumberPath<Long> id = createNumber("id", Long.class);

    public final NumberPath<Long> instructorId = createNumber("instructorId", Long.class);

    public final NumberPath<Integer> subscriberCount = createNumber("subscriberCount", Integer.class);

    public QSubscriptionHistory(String variable) {
        super(SubscriptionHistory.class, forVariable(variable));
    }

    public QSubscriptionHistory(Path<? extends SubscriptionHistory> path) {
        super(path.getType(), path.getMetadata());
    }

    public QSubscriptionHistory(PathMetadata metadata) {
        super(SubscriptionHistory.class, metadata);
    }

}

