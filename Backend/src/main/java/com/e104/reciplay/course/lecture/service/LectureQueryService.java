package com.e104.reciplay.course.lecture.service;

import com.e104.reciplay.course.lecture.dto.LectureDetail;
import com.e104.reciplay.course.lecture.dto.response.LectureSummary;

import java.util.List;

public interface LectureQueryService {
    List<LectureSummary> getLectureSummaries(Long courseId);
    LectureDetail getLectureDetail(Long lectureId);
    List<LectureDetail> getLectureDetails(Long courseId);
    void updateSkipStatus(Long lectureId, boolean isSkipped);
    void updateLecture(LectureDetail lectureDetail);
}
