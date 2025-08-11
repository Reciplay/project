package com.e104.reciplay.course.lecture.service;

import com.e104.reciplay.course.lecture.dto.LectureDetail;
import com.e104.reciplay.course.lecture.dto.LectureSummary;
import com.e104.reciplay.entity.Lecture;

import java.util.List;

public interface LectureQueryService {
    List<LectureSummary> queryLectureSummaries(Long courseId);
    LectureDetail queryLectureDetail(Long lectureId);
    List<LectureDetail> queryLectureDetails(Long courseId);
    List<Lecture> queryLecturesByCourseId(Long courseId);
    Lecture queryLectureById(Long id);
    Long queryCountByCourseId(Long courseId);
}
