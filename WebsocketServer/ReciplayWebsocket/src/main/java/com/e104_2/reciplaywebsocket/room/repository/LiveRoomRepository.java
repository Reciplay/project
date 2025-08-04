package com.e104_2.reciplaywebsocket.room.repository;

import com.e104_2.reciplaywebsocket.entity.LiveRoom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface LiveRoomRepository extends JpaRepository<LiveRoom, Long> {
    Optional<LiveRoom> findByLectureId(Long lectureId);
}
