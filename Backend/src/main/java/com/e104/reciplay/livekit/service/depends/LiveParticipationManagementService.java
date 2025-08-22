package com.e104.reciplay.livekit.service.depends;

import com.e104.reciplay.entity.LiveParticipation;
import com.e104.reciplay.entity.LiveRoom;

import java.util.List;

public interface LiveParticipationManagementService {
    void participateIn(Long liveRoomId, String email);
    void participateIn(LiveRoom liveRoom, String email);

    List<LiveParticipation> clearRoom(LiveRoom liveRoom);
}
