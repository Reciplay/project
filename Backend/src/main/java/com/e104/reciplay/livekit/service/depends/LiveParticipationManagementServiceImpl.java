package com.e104.reciplay.livekit.service.depends;

import com.e104.reciplay.entity.LiveParticipation;
import com.e104.reciplay.entity.LiveRoom;
import com.e104.reciplay.repository.LiveParticipationRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class LiveParticipationManagementServiceImpl implements LiveParticipationManagementService{
    private final LiveParticipationRepository liveParticipationRepository;

    @Override
    @Transactional
    public void participateIn(Long liveRoomId, String email) {
        LiveParticipation liveParticipation = new LiveParticipation();
        liveParticipation.setEmail(email);
        liveParticipation.setLiveRoomId(liveRoomId);
        liveParticipationRepository.save(liveParticipation);
    }

    @Override
    public void participateIn(LiveRoom liveRoom, String email) {
        LiveParticipation liveParticipation = new LiveParticipation();
        liveParticipation.setEmail(email);
        liveParticipation.setLiveRoomId(liveRoom.getId());
        liveParticipationRepository.save(liveParticipation);
    }

    @Override
    public List<LiveParticipation> clearRoom(LiveRoom liveRoom) {
        log.debug("라이브룸 참여이력 제거");
        List<LiveParticipation> members = liveParticipationRepository.findByLiveRoomId(liveRoom.getId());
        liveParticipationRepository.deleteByLiveRoomId(liveRoom.getId());
        return members;
    }
}
