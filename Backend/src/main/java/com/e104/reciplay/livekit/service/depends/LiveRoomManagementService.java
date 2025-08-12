package com.e104.reciplay.livekit.service.depends;

import com.e104.reciplay.entity.Lecture;
import com.e104.reciplay.entity.LiveParticipation;
import com.e104.reciplay.entity.LiveRoom;

import java.util.List;

public interface LiveRoomManagementService {
    LiveRoom openLiveRoom(Lecture lecture, String roomname);
    List<LiveParticipation> closeLiveRoom(LiveRoom liveRoom);
}
