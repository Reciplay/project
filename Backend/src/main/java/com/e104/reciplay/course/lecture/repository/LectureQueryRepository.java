package com.e104.reciplay.course.lecture.repository;

import com.e104.reciplay.course.lecture.dto.LectureDetail;
import com.e104.reciplay.course.lecture.dto.response.LectureSummary;

import java.util.List;

public interface LectureQueryRepository {
    List<LectureSummary> findLectureSummariesByCourseId(Long courseId);
    LectureDetail findLectureDetailById(Long lectureId);
    List<LectureDetail> findLectureDetailsByCourseId(Long courseId);
}
