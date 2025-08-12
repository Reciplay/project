package com.e104.reciplay.repository;

import com.e104.reciplay.entity.LiveParticipation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface LiveParticipationRepository extends JpaRepository<LiveParticipation, Long> {
    boolean existsByEmail(String email);
    void deleteByLiveRoomId(Long liveRoomId);
    List<LiveParticipation> findByLiveRoomId(Long liveRoomId);
}
