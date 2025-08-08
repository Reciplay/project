package com.e104.reciplay.repository;

import com.e104.reciplay.course.lecture.repository.CustomChapterRepository;
import com.e104.reciplay.entity.Chapter;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


public interface ChapterRepository extends JpaRepository<Chapter, Long>, CustomChapterRepository {
}
