package com.e104.reciplay.repository;

import com.e104.reciplay.entity.LectureHistory;
import com.e104.reciplay.repository.custom.CustomLectureHistoryRepository;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LectureHistoryRepository extends JpaRepository<LectureHistory, Long>, CustomLectureHistoryRepository {
    boolean existsByLectureIdAndUserId(Long lectureId, Long userId);
}
