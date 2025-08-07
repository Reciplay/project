package com.e104.reciplay.course.lecture.service;

import com.e104.reciplay.course.courses.dto.request.LectureRequest;
import com.e104.reciplay.course.lecture.dto.response.LectureDetail;
import com.e104.reciplay.course.lecture.dto.response.request.LectureRegisterRequest;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import java.util.List;

public interface LectureManagementService {
    void updateSkipStatus(Long lectureId, boolean isSkipped);
    void updateLecture(LectureDetail lectureDetail);

    List<LectureRegisterRequest> groupLectureAndMaterial(List<LectureRequest> lectureRequestList, MultipartHttpServletRequest multipartHttpServletRequest);

    void registerLectures(List<LectureRegisterRequest> requests, Long courseId);
}
