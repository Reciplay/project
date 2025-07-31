package com.e104.reciplay.livekit.service.depends;

import com.e104.reciplay.entity.LiveRoom;

public interface LiveRoomQueryService {
    LiveRoom queryLiveRoomById(Long liveRoomId);
    boolean isLiveLecture(Long lectureId);

    LiveRoom queryLiveRoomByLectureId(Long lectureId);
}
