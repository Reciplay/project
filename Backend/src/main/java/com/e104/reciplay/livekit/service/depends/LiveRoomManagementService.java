package com.e104.reciplay.livekit.service.depends;

import com.e104.reciplay.entity.Lecture;
import com.e104.reciplay.entity.LiveRoom;

public interface LiveRoomManagementService {
    LiveRoom openLiveRoom(Lecture lecture, String roomname);
}
