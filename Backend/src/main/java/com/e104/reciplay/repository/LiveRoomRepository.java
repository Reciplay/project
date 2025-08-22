package com.e104.reciplay.repository;

import com.e104.reciplay.entity.LiveRoom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface LiveRoomRepository extends JpaRepository<LiveRoom, Long> {
    boolean existsByLectureId(Long lectureId);
    Optional<LiveRoom> findByLectureId(Long lectureId);
}
