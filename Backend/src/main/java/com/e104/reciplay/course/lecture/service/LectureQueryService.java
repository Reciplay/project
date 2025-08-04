package com.e104.reciplay.course.lecture.service;

import com.e104.reciplay.course.lecture.dto.LectureDetail;
import com.e104.reciplay.course.lecture.dto.response.LectureSummary;

import java.util.List;

public interface LectureQueryService {
    List<LectureSummary> queryLectureSummaries(Long courseId);
    LectureDetail queryLectureDetail(Long lectureId);
    List<LectureDetail> queryLectureDetails(Long courseId);
}
