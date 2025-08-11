package com.e104.reciplay.course.lecture.repository;

import com.e104.reciplay.course.lecture.dto.LectureDetail;
import com.e104.reciplay.course.lecture.dto.LectureSummary;

import java.util.List;

public interface CustomLectureRepository {
    List<LectureSummary> findLectureSummariesByCourseId(Long courseId);
    LectureDetail findLectureDetailById(Long lectureId);
    List<LectureDetail> findLectureDetailsByCourseId(Long courseId);
}
