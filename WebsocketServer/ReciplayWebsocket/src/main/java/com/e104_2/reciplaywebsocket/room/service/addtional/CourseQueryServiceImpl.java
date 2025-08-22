package com.e104_2.reciplaywebsocket.room.service.addtional;

import com.e104_2.reciplaywebsocket.entity.Course;
import com.e104_2.reciplaywebsocket.room.repository.CourseRepository;
import com.e104_2.reciplaywebsocket.room.repository.LectureRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class CourseQueryServiceImpl implements CourseQueryService{
    private final CourseRepository courseRepository;
    private final LectureQueryService lectureQueryService;

    @Override
    public Course queryCourseOfLecture(Long lectureId) {
        Long courseId = lectureQueryService.queryLectureById(lectureId).getCourseId();
        return courseRepository.findById(courseId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 강좌 입니다. "+courseId));
    }

    @Override
    public Course queryCourseById(Long id) {
        return courseRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("해당하는 강좌가 존재하지 않습니다."));
    }
}
