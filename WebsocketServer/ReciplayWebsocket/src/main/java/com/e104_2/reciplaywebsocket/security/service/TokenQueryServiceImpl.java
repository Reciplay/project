package com.e104_2.reciplaywebsocket.security.service;

import com.e104_2.reciplaywebsocket.security.domain.Token;
import com.e104_2.reciplaywebsocket.security.jwt.JWTUtil;
import com.e104_2.reciplaywebsocket.security.repository.TokenRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class TokenQueryServiceImpl implements TokenQueryService{
    private final TokenRepository tokenRepository;
    private final JWTUtil jwtUtil;

    @Override
    public Boolean isInvalidToken(String token) {
        String username = jwtUtil.getUsername(token);
        Token validToken = tokenRepository.queryValidAccessTokens(username, token);
        return validToken == null;
    }
}
