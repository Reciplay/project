package com.e104_2.reciplaywebsocket.room.redis;

import jakarta.transaction.Transactional;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class RoomRedisServiceTest {
    @Autowired
    RoomRedisService roomRedisService;

    @Test
    @Transactional
    public void 방_구독_키_등록에_성공한다() {
        String uuid = roomRedisService.addRoomId("test1", 1L);
        System.out.println(uuid);
        String res = roomRedisService.getRoomId("test1", 1L);
        assertThat(uuid).isEqualTo(res);
    }

}