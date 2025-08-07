package com.e104.reciplay.course.lecture.service;

import com.e104.reciplay.course.lecture.dto.response.LectureSummary;
import com.e104.reciplay.repository.LectureRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class LectureSummaryQueryServiceImpl implements LectureSummaryQueryService{
    private final LectureRepository lectureRepository;
    @Override
    public List<LectureSummary> queryLectureSummariesByCourseId(Long courseId) {
        return lectureRepository.findLectureSummariesByCourseId(courseId);
    }
}
