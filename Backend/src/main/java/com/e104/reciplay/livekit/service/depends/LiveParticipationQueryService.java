package com.e104.reciplay.livekit.service.depends;

import com.e104.reciplay.entity.LiveParticipation;

public interface LiveParticipationQueryService {
    Boolean isInAnyLiveRoom(String email);
    LiveParticipation queryLiveParticipationOf(Long lectureId, String email);
}
