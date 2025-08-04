package com.e104_2.reciplaywebsocket.room.redis;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.SetOperations;
import org.springframework.stereotype.Service;

import java.time.Duration;

@Service
@RequiredArgsConstructor
public class ForceQuitRedisService {
    private final RedisTemplate<String, String> redisTemplate;

    // private final SetOperations<String, String> setOperations = redisTemplate.opsForSet();
    // Null Pointer Exception 을 피하기 위한 조치.

    public void addUserInForceQuit(String email, Long lectureId) {
        SetOperations<String, String> setOperations = redisTemplate.opsForSet();

        String key = getRedisKey(lectureId);

        // 먼저 값을 추가해서 key가 생성되도록 함
        setOperations.add(key, email);

        // 이후 key가 처음 생성된 경우에만 TTL 설정
        if (redisTemplate.opsForSet().size(key) == 1L) {
            redisTemplate.expire(key, Duration.ofHours(3));
        }
    }

    public boolean isOnQuitList(String email, Long lectureId) {
        SetOperations<String, String> setOperations = redisTemplate.opsForSet();
        return setOperations.isMember(getRedisKey(lectureId), email);
    }

    public String getRedisKey(Long lectureId) {
        return "forcequit:lecture:"+lectureId.toString();
    }
}
