package com.e104.reciplay.livekit.service.depends;

import com.e104.reciplay.entity.LiveParticipation;
import com.e104.reciplay.entity.LiveRoom;
import com.e104.reciplay.repository.LiveParticipationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class LiveParticipationQueryServiceImpl implements LiveParticipationQueryService{
    private final LiveParticipationRepository liveParticipationRepository;
    private final LiveRoomQueryService liveRoomQueryService;

    @Override
    public Boolean isInAnyLiveRoom(String email) {
        return liveParticipationRepository.existsByEmail(email);
    }

    @Override
    public LiveParticipation queryLiveParticipationOf(Long lectureId, String email) {
        LiveRoom liveRoom = liveRoomQueryService.queryLiveRoomByLectureId(lectureId);
        return liveParticipationRepository.findByLiveRoomIdAndEmail(liveRoom.getId(), email)
                .orElse(null);
    }
}
