package com.e104.reciplay.repository;

import com.e104.reciplay.course.lecture.repository.CustomLectureRepository;
import com.e104.reciplay.entity.Lecture;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LectureRepository extends JpaRepository<Lecture, Long>, CustomLectureRepository {
    List<Lecture> findByCourseId(Long courseId);
    Long countByCourseId(Long courseId);
    int deleteByCourseId(Long courseId);
}
