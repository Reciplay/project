package com.e104.reciplay.livekit.service.depends;

import com.e104.reciplay.entity.Lecture;
import com.e104.reciplay.entity.LiveParticipation;
import com.e104.reciplay.entity.LiveRoom;
import com.e104.reciplay.repository.LiveRoomRepository;
import com.e104.reciplay.user.security.service.UserQueryService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class LiveRoomManagementServiceImpl implements LiveRoomManagementService{
    private final LiveRoomRepository liveRoomRepository;
    private final LiveParticipationManagementService liveParticipationManagementService;
    private final UserQueryService userQueryService;

    @Override
    @Transactional
    public LiveRoom openLiveRoom(Lecture lecture, String roomname) {
        LiveRoom liveRoom = new LiveRoom();
        liveRoom.setRoomname(roomname);
        liveRoom.setLectureId(lecture.getId());
        return liveRoomRepository.save(liveRoom);
    }

    @Override
    public List<LiveParticipation> closeLiveRoom(LiveRoom liveRoom) {
        log.debug("라이브룸 닫기");
        List<LiveParticipation> userIds = liveParticipationManagementService.clearRoom(liveRoom);

        log.debug("참여 이력 모으기 {}", userIds);
        liveRoomRepository.delete(liveRoom);
        log.debug("라이브룸 제거함.");
        return userIds;
    }
}
