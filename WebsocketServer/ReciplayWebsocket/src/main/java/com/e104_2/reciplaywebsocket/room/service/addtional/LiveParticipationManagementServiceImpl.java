package com.e104_2.reciplaywebsocket.room.service.addtional;

import com.e104_2.reciplaywebsocket.entity.LiveParticipation;
import com.e104_2.reciplaywebsocket.room.repository.LiveParticipationRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
@Slf4j
public class LiveParticipationManagementServiceImpl implements LiveParticipationManagementService{
    private final LiveParticipationRepository liveParticipationRepository;

    @Override
    @Transactional
    public void quitFromLiveRoom(Long liveRoomId, String email) {
        LiveParticipation participation = liveParticipationRepository.findByLiveRoomIdAndEmail(liveRoomId, email)
                .orElseThrow(() -> new IllegalArgumentException("참여 이력이 존재하지 않습니다."));
        liveParticipationRepository.delete(participation);
    }
}
