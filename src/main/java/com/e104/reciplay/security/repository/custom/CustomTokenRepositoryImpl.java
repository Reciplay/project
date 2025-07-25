package com.e104.reciplay.security.repository.custom;

import com.e104.reciplay.security.domain.QToken;
import com.e104.reciplay.security.domain.Token;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;


/*
 토큰 재발급 할 때마다, 이전 토큰은 제거해야 함.

 */
@Repository
@RequiredArgsConstructor
public class CustomTokenRepositoryImpl implements CustomTokenRepository{
    private final JPAQueryFactory queryFactory;
    private QToken token = QToken.token;

    @Override
    public boolean isValidToken(String plain, String username, String type) {
        Integer count = queryFactory.selectOne().from(token).where(
                token.plain.eq(plain),
                token.isExpired.eq(false),
                token.username.eq(username),
                token.type.eq(type)
                ).fetchFirst();

        return count != null;
    }

    @Override
    public Token findValidTokenByPlainAndUsername(String plain, String username, String type) {
        return queryFactory.select(token).from(token).where(
                token.username.eq(username),
                token.plain.eq(plain),
                token.isExpired.eq(false),
                token.type.eq(type)
        ).fetchFirst();
    }

}
