package com.e104.reciplay.user.auth.redis;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class AuthRedisService {
    private final RedisTemplate<String, String> template;

    public void registAuthToken(String purpose, String identity, String token, Integer exp) {
        ValueOperations<String, String> operations = template.opsForValue();
        operations.set("auth:"+purpose+":"+identity, token);
        template.expire("auth:"+purpose+":"+identity, exp, TimeUnit.MINUTES);
    }

    public String getAuthToken(String purpose, String identity) {
        ValueOperations<String, String> operations = template.opsForValue();
        return operations.getAndDelete("auth:"+purpose+":"+identity); // could be null;
    }
}
