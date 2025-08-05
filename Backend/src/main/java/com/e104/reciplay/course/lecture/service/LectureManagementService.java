package com.e104.reciplay.course.lecture.service;

import com.e104.reciplay.course.lecture.dto.response.LectureDetail;

public interface LectureManagementService {
    void updateSkipStatus(Long lectureId, boolean isSkipped);
    void updateLecture(LectureDetail lectureDetail);
}
