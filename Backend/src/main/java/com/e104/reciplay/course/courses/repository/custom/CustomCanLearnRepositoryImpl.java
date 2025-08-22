package com.e104.reciplay.course.courses.repository.custom;

import com.e104.reciplay.entity.QCanLearn;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;

@RequiredArgsConstructor
@Repository
public class CustomCanLearnRepositoryImpl implements CustomCanLearnRepository{
    private final JPAQueryFactory queryFactory;
    private final QCanLearn canLearn = QCanLearn.canLearn;
    public List<String> findContentsByCourseId(Long courseId){
        return queryFactory
                .select(canLearn.content)
                .from(canLearn)
                .where(canLearn.courseId.eq(courseId))
                .fetch(); // List<String> 반환
    }

    @Override
    public void insertCanLearnsWithCourseId(Long courseId, List<String> canLearns) {
        for (String content : canLearns) {
            queryFactory
                    .insert(canLearn)
                    .columns(canLearn.courseId, canLearn.content)
                    .values(courseId, content)
                    .execute();
        }
    }
}
