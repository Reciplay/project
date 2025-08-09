package com.e104.reciplay.repository.custom.impl;

import com.e104.reciplay.entity.QInstructor;
import com.e104.reciplay.repository.custom.CustomInstructorRepository;
import com.e104.reciplay.user.security.domain.QUser;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class CustomInstructorRepositoryImpl implements CustomInstructorRepository {
    private final JPAQueryFactory queryFactory;

    private final QInstructor instructor = QInstructor.instructor;
    private final QUser user = QUser.user;

    @Override
    public Long findIdByemail(String email) {
        return queryFactory
                .select(instructor.id)
                .from(instructor)
                .join(user).on(instructor.userId.eq(user.id))
                .where(user.email.eq(email))
                .fetchOne();
        }

    @Override
    public String findNameById(Long id) {
        return queryFactory
                .select(user.name)
                .from(instructor)
                .join(user).on(instructor.userId.eq(user.id))
                .where(instructor.id.eq(id))
                .fetchOne();
    }
}
