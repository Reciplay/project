package com.e104.reciplay.repository;

import com.e104.reciplay.course.lecture.repository.CustomLectureRepository;
import com.e104.reciplay.entity.Lecture;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LectureRepository extends JpaRepository<Lecture, Long>, CustomLectureRepository {
}
