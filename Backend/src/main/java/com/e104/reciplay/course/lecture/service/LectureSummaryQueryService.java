package com.e104.reciplay.course.lecture.service;

import com.e104.reciplay.course.lecture.dto.response.LectureSummary;

import java.util.List;

public interface LectureSummaryQueryService {
    List<LectureSummary>  queryLectureSummariesByCourseId(Long courseId);
}
