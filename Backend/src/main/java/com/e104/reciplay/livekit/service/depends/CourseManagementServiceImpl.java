package com.e104.reciplay.livekit.service.depends;

import com.e104.reciplay.course.lecture.dto.response.response.CourseTerm;
import com.e104.reciplay.entity.Course;
import com.e104.reciplay.repository.CourseRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class CourseManagementServiceImpl implements CourseManagementService{
    private final CourseRepository courseRepository;

    @Override
    @Transactional
    public void activateLiveState(Long courseId) {
        Course course = courseRepository.findById(courseId).orElseThrow(() -> new IllegalArgumentException("존재하지 않는 강좌 ID 입니다."));
        course.setIsLive(true);
    }

    @Override
    @Transactional
    public void setCourseTerm(CourseTerm term, Long courseId) {
        Course course = courseRepository.findById(courseId).orElseThrow(() -> new IllegalArgumentException("존재하지 않는 강좌 ID 입니다."));
        course.setCourseStartDate(term.getStartDate());
        course.setCourseEndDate(term.getEndDate());
    }
}
