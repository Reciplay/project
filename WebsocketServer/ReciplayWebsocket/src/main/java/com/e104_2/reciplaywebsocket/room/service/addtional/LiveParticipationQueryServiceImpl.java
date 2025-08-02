package com.e104_2.reciplaywebsocket.room.service.addtional;

import com.e104_2.reciplaywebsocket.room.repository.LiveParticipationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class LiveParticipationQueryServiceImpl implements LiveParticipationQueryService {
    private final LiveParticipationRepository liveParticipationRepository;

    @Override
    public boolean queryUserParticipatedIn(String email, Long liveRoomId) {
        return liveParticipationRepository.existsByLiveRoomIdAndEmail(liveRoomId, email);
    }
}
