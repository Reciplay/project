package com.e104.reciplay.user.lecture_history.service;

import com.e104.reciplay.course.lecture.service.LectureQueryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class PersonalStatServiceImpl implements PersonalStatService{
    private final LectureQueryService lectureQueryService;
    private final
    @Override
    public Double calcCourseProgress(Long courseId, String email) {
        return null;
    }
}
