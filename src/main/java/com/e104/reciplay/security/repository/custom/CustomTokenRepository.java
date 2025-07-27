package com.e104.reciplay.security.repository.custom;

import com.e104.reciplay.security.domain.Token;

public interface CustomTokenRepository {
    boolean isValidToken(String plain, String username, String type);
    Token findValidTokenByPlainAndUsername(String plain, String username, String type);
}
