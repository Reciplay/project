package com.e104.reciplay.livekit.service.depends;

import com.e104.reciplay.entity.Lecture;
import com.e104.reciplay.entity.LiveRoom;
import com.e104.reciplay.repository.LiveRoomRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class LiveRoomManagementServiceImpl implements LiveRoomManagementService{
    private final LiveRoomRepository liveRoomRepository;

    @Override
    @Transactional
    public LiveRoom openLiveRoom(Lecture lecture, String roomname) {
        LiveRoom liveRoom = new LiveRoom();
        liveRoom.setRoomname(roomname);
        liveRoom.setLectureId(lecture.getId());
        return liveRoomRepository.save(liveRoom);
    }
}
