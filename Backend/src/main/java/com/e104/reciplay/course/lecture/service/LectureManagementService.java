package com.e104.reciplay.course.lecture.service;

import com.e104.reciplay.course.lecture.dto.LectureControlRequest;
import com.e104.reciplay.course.lecture.dto.request.item.LectureRegisterRequest;
import com.e104.reciplay.course.lecture.dto.request.LectureRequest;
import com.e104.reciplay.course.lecture.dto.response.CourseTerm;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import java.io.IOException;
import java.util.List;

public interface LectureManagementService {
    void updateSkipStatus(Long lectureId, boolean isSkipped, String email);
    void updateLecture(List<LectureRequest> requests, Long courseId, String email) throws IOException;

    List<LectureRequest> groupLectureAndMaterial(List<? extends LectureControlRequest> lectureRequestList, MultipartHttpServletRequest multipartHttpServletRequest);

    CourseTerm registerLectures(List<LectureRequest> requests, Long courseId, String email);
}
