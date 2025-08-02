package com.e104.reciplay.livekit.service.depends;

import com.e104.reciplay.entity.LiveRoom;
import com.e104.reciplay.repository.LiveRoomRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class LiveRoomQueryServiceImpl implements LiveRoomQueryService{
    private final LiveRoomRepository liveRoomRepository;

    @Override
    public LiveRoom queryLiveRoomById(Long liveRoomId) {
        return liveRoomRepository.findById(liveRoomId).orElseThrow(()->new IllegalArgumentException("개설되지 않은 라이브방입니다."));
    }

    @Override
    public boolean isLiveLecture(Long lecureId) {
        return liveRoomRepository.existsByLectureId(lecureId);
    }

    @Override
    public LiveRoom queryLiveRoomByLectureId(Long lectureId) {
        return liveRoomRepository.findByLectureId(lectureId).orElseThrow(() -> new IllegalArgumentException("라이브 중이 아닌 강의입니다."));
    }
}
