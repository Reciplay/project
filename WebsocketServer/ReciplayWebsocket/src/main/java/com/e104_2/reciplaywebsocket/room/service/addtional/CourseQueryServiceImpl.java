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

    @Override
    public Course queryCourseOfLecture(Long lectureId) {
        return null;
    }

    @Override
    public Course queryCourseById(Long id) {
        return courseRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("해당하는 강좌가 존재하지 않습니다."));
    }
}
