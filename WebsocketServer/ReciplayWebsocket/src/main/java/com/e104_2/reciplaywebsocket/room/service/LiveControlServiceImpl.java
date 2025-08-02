package com.e104_2.reciplaywebsocket.room.service;


import com.e104_2.reciplaywebsocket.entity.Lecture;
import com.e104_2.reciplaywebsocket.entity.LiveRoom;
import com.e104_2.reciplaywebsocket.room.service.addtional.LiveParticipationManagementService;
import com.e104_2.reciplaywebsocket.room.service.addtional.LiveParticipationManagementServiceImpl;
import com.e104_2.reciplaywebsocket.room.service.addtional.LiveParticipationQueryService;
import com.e104_2.reciplaywebsocket.room.service.addtional.LiveRoomQueryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class LiveControlServiceImpl implements LiveControlService{
    private final LiveRoomQueryService liveRoomQueryService;
    private final LiveParticipationQueryService liveParticipationQueryService;
    private final LiveParticipationManagementService liveParticipationManagementService;

    @Override
    public Boolean checkParticipationHistory(String email, Long lectureId) {
        LiveRoom liveRoom = liveRoomQueryService.queryLiveRoomByLectureId(lectureId);
        return liveParticipationQueryService.queryUserParticipatedIn(email, liveRoom.getId());
    }

    @Override
    public void quitFromLiveRoom(String email, Long lectureId) {
        LiveRoom liveRoom = liveRoomQueryService.queryLiveRoomByLectureId(lectureId);
        liveParticipationManagementService.quitFromLiveRoom(liveRoom.getId(), email);
    }
}
