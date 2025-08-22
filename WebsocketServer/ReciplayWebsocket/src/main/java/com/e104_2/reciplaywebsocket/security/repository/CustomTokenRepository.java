package com.e104_2.reciplaywebsocket.security.repository;

import com.e104_2.reciplaywebsocket.security.domain.Token;

public interface CustomTokenRepository {
    Token queryValidAccessTokens(String username, String plain);
}
