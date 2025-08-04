package com.e104_2.reciplaywebsocket.room.service.addtional;

import com.e104_2.reciplaywebsocket.entity.LiveRoom;
import com.e104_2.reciplaywebsocket.room.repository.LiveRoomRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class LiveRoomQueryServiceImpl implements LiveRoomQueryService{
    private final LiveRoomRepository liveRoomRepository;

    @Override
    public LiveRoom queryLiveRoomByLectureId(Long lectureId) {
        return liveRoomRepository.findByLectureId(lectureId)
                .orElseThrow(() -> new IllegalArgumentException("라이브 강의가 개설되지 않은 강의 입니다."));
    }
}
