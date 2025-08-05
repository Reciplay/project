package com.e104.reciplay.repository;

import com.e104.reciplay.course.lecture.repository.LectureQueryRepository;
import com.e104.reciplay.entity.Lecture;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

public interface LectureRepository extends JpaRepository<Lecture, Long>, LectureQueryRepository {
}
