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

    public void addUserInForceQuit(String email, String roomId) {
        SetOperations<String, String> setOperations = redisTemplate.opsForSet();

        // 먼저 값을 추가해서 key가 생성되도록 함
        setOperations.add(roomId, email);

        // 이후 key가 처음 생성된 경우에만 TTL 설정
        if (setOperations.size(roomId) == 1L) {
            redisTemplate.expire(roomId, Duration.ofHours(3));
        }
    }

    public boolean isOnQuitList(String email, String roomId) {
        SetOperations<String, String> setOperations = redisTemplate.opsForSet();
        return setOperations.isMember(roomId, email);
    }

}
