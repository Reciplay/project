package com.e104.reciplay.livekit.redis;

import com.e104.reciplay.livekit.exception.RoomIdExpiredException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.stereotype.Service;

import java.util.UUID;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class RoomRedisService {
    private final RedisTemplate<String, String> redisTemplate;

    public String addRoomId(String lectureName, Long lectureId) {
        String roomId = UUID.randomUUID().toString();

        ValueOperations<String, String> operations = redisTemplate.opsForValue();

        operations.set(getRoomKey(lectureName, lectureId), roomId);
        redisTemplate.expire(getRoomKey(lectureName, lectureId), 5, TimeUnit.HOURS);
        return roomId;
    }

    public String getRoomId(String lectureName, Long lectureId) {
        ValueOperations<String, String> operations = redisTemplate.opsForValue();
        String roomId = operations.get(getRoomKey(lectureName, lectureId));
        if(roomId == null)  {
            throw new RoomIdExpiredException("만료된 강의 입니다.");
        }
        return roomId;
    }

    private String getRoomKey(String lectureName, Long lectureId) {
        return String.format("%s:room:%d", lectureName, lectureId);
    }
}
