package com.e104_2.reciplaywebsocket.security.service;

public interface TokenQueryService {
    Boolean isInvalidToken(String token);
}
