package com.e104_2.reciplaywebsocket.room.repository;

import com.e104_2.reciplaywebsocket.entity.Chapter;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ChapterRepository extends JpaRepository<Chapter, Long> {
    Optional<Chapter> findByLectureIdAndSequence(Long lectureId, Integer sequence);
}
