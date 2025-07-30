package com.e104.reciplay.livekit.service.depends;

import com.e104.reciplay.entity.LiveRoom;

public interface LiveParticipationManagementService {
    void participateIn(Long liveRoomId, String email);
    void participateIn(LiveRoom liveRoom, String email);
}
