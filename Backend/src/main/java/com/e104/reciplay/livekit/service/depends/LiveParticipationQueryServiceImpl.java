package com.e104.reciplay.livekit.service.depends;

import com.e104.reciplay.repository.LiveParticipationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class LiveParticipationQueryServiceImpl implements LiveParticipationQueryService{
    LiveParticipationRepository liveParticipationRepository;

    @Override
    public Boolean isInAnyLiveRoom(String email) {
        return liveParticipationRepository.existsByEmail(email);
    }
}
