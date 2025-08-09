package com.e104.reciplay.user.lecture_history.service;

import com.e104.reciplay.course.lecture.service.LectureQueryService;
import com.e104.reciplay.repository.LectureHistoryRepository;
import com.e104.reciplay.user.security.domain.User;
import com.e104.reciplay.user.security.service.UserQueryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class PersonalStatServiceImpl implements PersonalStatService{
    private final LectureQueryService lectureQueryService;
    private final LectureHistoryRepository lectureHistoryRepository;
    private final UserQueryService userQueryService;

    @Override
    public Double calcCourseProgress(Long courseId, String email) {
        User user = userQueryService.queryUserByEmail(email);
        long totalLectures = lectureQueryService.queryCountByCourseId(courseId);
        if (totalLectures == 0) {
            throw new IllegalArgumentException("강좌에 강의가 존재하지 않습니다.");
        }
        try {
            return (double) lectureHistoryRepository.countHistoryOfCourse(courseId, user.getId()) / totalLectures;
        } catch (ArithmeticException e) {
            throw new IllegalArgumentException("강좌에 강의가 존재하지 않습니다.");
        }
    }
}
