package com.e104.reciplay.user.security.repository.custom;

import com.e104.reciplay.user.security.domain.QUser;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class CustomUserRepositoryImpl implements  CustomUserRepository{
    private final JPAQueryFactory queryFactory;

    private final QUser user = QUser.user;

    @Override
    public void updateUserRoleToInstructorById(Long userId) {
        queryFactory
                .update(user)
                .set(user.role, "ROLE_INSTRUCTOR")
                .where(user.id.eq(userId))
                .execute();
    }
}
