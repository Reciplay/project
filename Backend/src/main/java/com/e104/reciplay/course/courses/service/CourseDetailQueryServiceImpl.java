package com.e104.reciplay.course.courses.service;

import com.e104.reciplay.course.courses.dto.response.CourseDetail;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class CourseDetailQueryServiceImpl implements CourseDetailQueryService{

    @Override
    public CourseDetail queryCourseDetailByCourseId(Long courseId) {

        return null;
    }
}
