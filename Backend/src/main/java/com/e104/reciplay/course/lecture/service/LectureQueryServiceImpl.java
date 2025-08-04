package com.e104.reciplay.course.lecture.service;

import com.e104.reciplay.common.exception.CourseNotFoundException;
import com.e104.reciplay.common.exception.LectureNotFoundException;
import com.e104.reciplay.course.lecture.dto.LectureDetail;
import com.e104.reciplay.course.lecture.dto.response.LectureSummary;
import com.e104.reciplay.course.lecture.repository.LectureQueryRepository;
import com.e104.reciplay.entity.Lecture;
import com.e104.reciplay.entity.QLecture;
import com.e104.reciplay.repository.CourseRepository;
import com.querydsl.core.QueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class LectureQueryServiceImpl implements LectureQueryService{
    private final LectureQueryRepository lectureQueryRepository;
    private final CourseRepository courseRepository;
    @Override
    public List<LectureSummary> getLectureSummaries(Long courseId) {
        if (!courseRepository.existsById(courseId)) {
            throw new CourseNotFoundException(courseId);
        }
        return lectureQueryRepository.findLectureSummariesByCourseId(courseId);
    }

    @Override
    public LectureDetail getLectureDetail(Long lectureId) {
        LectureDetail detail = lectureQueryRepository.findLectureDetailById(lectureId);
        if (detail == null) {
            throw new LectureNotFoundException(lectureId);
        }
        return detail;
    }


}
