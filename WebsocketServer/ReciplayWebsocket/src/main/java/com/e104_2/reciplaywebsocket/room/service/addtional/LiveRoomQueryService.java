package com.e104_2.reciplaywebsocket.room.service.addtional;

import com.e104_2.reciplaywebsocket.entity.LiveRoom;

public interface LiveRoomQueryService {
    LiveRoom queryLiveRoomByLectureId(Long lectureId);
}
