package com.e104.reciplay.repository;

import com.e104.reciplay.course.lecture.repository.CustomChapterRepository;
import com.e104.reciplay.entity.Chapter;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;


public interface ChapterRepository extends JpaRepository<Chapter, Long>, CustomChapterRepository {
    List<Chapter> findByLectureId(Long lectureId);
    int deleteAllByLectureIdIn(List<Long> ids);
}
