package com.e104.reciplay.user.security.repository.custom;

import com.e104.reciplay.user.security.domain.Token;

public interface CustomTokenRepository {
    boolean isValidToken(String plain, String username, String type);
    Token findValidTokenByPlainAndUsername(String plain, String username, String type);
}
