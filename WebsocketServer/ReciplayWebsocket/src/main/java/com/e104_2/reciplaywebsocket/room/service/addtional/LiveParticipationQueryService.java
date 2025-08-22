package com.e104_2.reciplaywebsocket.room.service.addtional;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

public interface LiveParticipationQueryService {
    boolean queryUserParticipatedIn(String email, Long liveRoomId);

}
