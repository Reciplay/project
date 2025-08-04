package com.e104_2.reciplaywebsocket.room.repository;

import com.e104_2.reciplaywebsocket.entity.LiveParticipation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface LiveParticipationRepository extends JpaRepository<LiveParticipation, Long> {
    boolean existsByLiveRoomIdAndEmail(Long liveRoomId, String email);
    Optional<LiveParticipation> findByLiveRoomIdAndEmail(Long liveRoomId, String email);
}
