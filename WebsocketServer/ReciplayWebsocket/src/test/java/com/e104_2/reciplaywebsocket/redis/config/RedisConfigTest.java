package com.e104_2.reciplaywebsocket.redis.config;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;

import java.time.Duration;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class RedisConfigTest {
    @Autowired
    private RedisTemplate<String, String> redisTemplate;

    @Test
    public void 레디스로_데이터_조회에_성공한다() {
        ValueOperations<String, String> operations = redisTemplate.opsForValue();

        String key = "name";
        operations.set(key, "h12e104");
        operations.getAndExpire("name", Duration.ofSeconds(10));
        String value = operations.get(key);

        assertThat(value).isEqualTo("h12e104");
    }
}