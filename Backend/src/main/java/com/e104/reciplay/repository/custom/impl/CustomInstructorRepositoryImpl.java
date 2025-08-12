package com.e104.reciplay.repository.custom.impl;

import com.e104.reciplay.admin.dto.response.AdInstructorDetail;
import com.e104.reciplay.admin.dto.response.AdInstructorSummary;
import com.e104.reciplay.entity.QInstructor;
import com.e104.reciplay.repository.custom.CustomInstructorRepository;
import com.e104.reciplay.user.security.domain.QUser;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class CustomInstructorRepositoryImpl implements CustomInstructorRepository {
    private final JPAQueryFactory queryFactory;

    private final QInstructor instructor = QInstructor.instructor;
    private final QUser user = QUser.user;

    @Override
    public Long findIdByEmail(String email) {
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

    @Override
    public List<AdInstructorSummary> findAdInstructorSummariesByIsApprove(Boolean isApprove) {
        return queryFactory
                .select(com.querydsl.core.types.Projections.constructor(
                        AdInstructorSummary.class,
                        instructor.id,            // instructorId
                        user.name,                // name
                        user.email,               // email
                        instructor.registeredAt   // registeredAt
                ))
                .from(instructor)
                .join(user).on(instructor.userId.eq(user.id))
                .where(instructor.isApproved.eq(isApprove))
                .orderBy(instructor.registeredAt.desc())
                .fetch();
    }

    @Override
    public AdInstructorDetail findAdInstructorDetailByInstructorId(Long instructorId) {
        return queryFactory
                .select(com.querydsl.core.types.Projections.bean(
                        AdInstructorDetail.class,
                        instructor.id.as("instructorId"),
                        user.name.as("name"),
                        user.email.as("email"),
                        instructor.registeredAt.as("registeredAt"),
                        user.nickname.as("nickName"),
                        user.birthDate.as("birthDate"),
                        user.createdAt.as("createdAt"),
                        instructor.introduction.as("introduction"),
                        instructor.address.as("address"),
                        instructor.phoneNumber.as("phoneNumber")
                ))
                .from(instructor)
                .join(user).on(instructor.userId.eq(user.id))
                .where(instructor.id.eq(instructorId))
                .fetchOne();
    }

    @Override
    public void updateInstructorApprovalByInstructorId(Long instructorId) {
        queryFactory
                .update(instructor)
                .set(instructor.isApproved, true)
                .where(instructor.id.eq(instructorId))
                .execute();
    }

}
