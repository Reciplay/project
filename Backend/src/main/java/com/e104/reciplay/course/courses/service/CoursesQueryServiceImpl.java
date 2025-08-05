package com.e104.reciplay.course.courses.service;

import com.e104.reciplay.course.courses.dto.response.CourseCard;
import com.e104.reciplay.course.courses.dto.response.CourseDetail;
import com.e104.reciplay.course.courses.repository.CourseQueryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class CoursesQueryServiceImpl implements CoursesQueryService {
    private final CourseQueryRepository courseQueryRepository;

    @Override
    public List<CourseCard> queryCourseCardListByInstructorId(Long instructorId) {
        return null;
    }

    @Override
    public CourseDetail queryCourseByCourseId(Long courseId) {
        return courseQueryRepository.findCourseByCourseId(courseId);
    }

    @Override
    public List<CourseDetail> queryCoursesByInstructorId(Long instructorId) {
        return courseQueryRepository.findCoursesByInstructorId(instructorId);
    }
}
