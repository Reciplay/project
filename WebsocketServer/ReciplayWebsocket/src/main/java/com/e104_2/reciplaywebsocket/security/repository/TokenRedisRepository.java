package com.e104_2.reciplaywebsocket.security.repository;

import com.e104_2.reciplaywebsocket.security.domain.Token;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.concurrent.TimeUnit;

@Repository
@RequiredArgsConstructor
public class TokenRedisRepository implements TokenRepository {

    private final RedisTemplate<String, String> redisTemplate;
    private final String ACCESS_KEY_PRIFIX = "token:access:";
    private final String REFRESH_KEY_PRIFIX = "token:refresh:";


    public String getKey(String username, String type) {
        StringBuilder sb = new StringBuilder();
        if(type.equals("ACCESS")){
            sb.append(ACCESS_KEY_PRIFIX);
        } else {
            sb.append(REFRESH_KEY_PRIFIX);
        }
        return sb.append(username).toString();
    }

    @Override
    public Token queryValidAccessTokens(String username, String plain) {
        ValueOperations<String, String> valueOperations = redisTemplate.opsForValue();
        String token = valueOperations.get(getKey(username, "ACCESS"));
        return (token != null) ? new Token(null, token, false, "ACCESS", null, username) : null;
    }
}
