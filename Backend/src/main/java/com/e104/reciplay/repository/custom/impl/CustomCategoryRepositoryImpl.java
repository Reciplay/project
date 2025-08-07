package com.e104.reciplay.repository.custom.impl;

import com.e104.reciplay.entity.QCategory;
import com.e104.reciplay.entity.QCourse;
import com.e104.reciplay.repository.custom.CustomCategoryRepository;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class CustomCategoryRepositoryImpl implements CustomCategoryRepository {
    private final JPAQueryFactory queryFactory;

    QCourse course = QCourse.course;
    QCategory category = QCategory.category;

    @Override
    public String findNameByCourseId(Long courseId) {
        return queryFactory
                .select(category.name)
                .from(course)
                .join(category)
                .on(course.categoryId.eq(category.id))
                .where(course.id.eq(courseId))
                .fetchOne();
    }
}
