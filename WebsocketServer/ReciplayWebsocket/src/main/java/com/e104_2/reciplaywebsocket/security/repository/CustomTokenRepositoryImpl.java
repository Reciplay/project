package com.e104_2.reciplaywebsocket.security.repository;

import com.e104_2.reciplaywebsocket.security.domain.QToken;
import com.e104_2.reciplaywebsocket.security.domain.Token;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class CustomTokenRepositoryImpl implements CustomTokenRepository{
    private final JPAQueryFactory queryFactory;

    private final QToken token = QToken.token;


    @Override
    public Token queryValidAccessTokens(String username, String plain) {
        return queryFactory.select(token).from(token)
                .where(token.isExpired.eq(false),
                        token.username.eq(username),
                        token.plain.eq(plain),
                        token.type.eq("ACCESS")
                ).fetchFirst();
    }
}
