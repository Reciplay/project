package com.e104.reciplay.repository.custom.impl;

import com.e104.reciplay.entity.Level;
import com.e104.reciplay.entity.QLevel;
import com.e104.reciplay.repository.custom.CustomLevelRepository;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class CustomLevelRepositoryImpl implements CustomLevelRepository {
    private final JPAQueryFactory queryFactory;
    private QLevel level = QLevel.level1;

    @Override
    public List<Level> findUserLevels(Long userId) {
        return queryFactory.select(level).from(level)
                .where(level.userId.eq(userId)).fetch();
    }
}
