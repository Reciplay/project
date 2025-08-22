package com.e104.reciplay.user.security.repository.custom;

import com.e104.reciplay.user.security.domain.Token;
import com.e104.reciplay.user.security.repository.TokenRepository;
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
    @Value("${spring.jwt.expiration}")
    private long ACCESS_TOKEN_EXPIRATION;
    @Value("${spring.jwt.refresh-token.expiration}")
    private long REFRESH_TOKEN_EXPIRATION;

    private final RedisTemplate<String, String> redisTemplate;
    private final String ACCESS_KEY_PRIFIX = "token:access:";
    private final String REFRESH_KEY_PRIFIX = "token:refresh:";

    @Override
    public List<Token> findByUsernameAndIsExpired(String username, Boolean isExpired) {
        return List.of();
    }

    @Override
    public List<Token> findByUsernameAndIsExpiredAndType(String username, Boolean isExpired, String type) {
        return List.of();
    }

    @Override
    public Token save(Token token) {
        ValueOperations<String, String> valueOperations = redisTemplate.opsForValue();
        String key = this.getKey(token.getUsername(), token.getType());
        valueOperations.set(key, token.getPlain());

        long seconds = (token.getType().equals("ACCESS") ? ACCESS_TOKEN_EXPIRATION : REFRESH_TOKEN_EXPIRATION);
        redisTemplate.expire(key, seconds, TimeUnit.MILLISECONDS);

        return token;
    }

    @Override
    public void deleteTokens(String username, String type) {
        ValueOperations<String, String> valueOperations = redisTemplate.opsForValue();
        valueOperations.getAndDelete(this.getKey(username, type));
    }

    @Override
    public boolean isValidToken(String plain, String username, String type) {
        ValueOperations<String, String> valueOperations = redisTemplate.opsForValue();
        String original = valueOperations.get(getKey(username, type));

        return original != null && plain.equals(original);
    }

    @Override
    public Token findValidTokenByPlainAndUsername(String plain, String username, String type) {
        ValueOperations<String, String> valueOperations = redisTemplate.opsForValue();
        String hash = valueOperations.get(getKey(username, type));
        return (hash == null) ? null : new Token(null, hash, false, type, LocalDateTime.now(), username);
    }

    public String getKey(String username, String type) {
        StringBuilder sb = new StringBuilder();
        if(type.equals("ACCESS")){
            sb.append(ACCESS_KEY_PRIFIX);
        } else {
            sb.append(REFRESH_KEY_PRIFIX);
        }
        return sb.append(username).toString();
    }
}
