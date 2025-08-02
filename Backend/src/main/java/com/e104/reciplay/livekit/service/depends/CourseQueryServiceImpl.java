package com.e104.reciplay.livekit.service.depends;

import com.e104.reciplay.entity.Course;
import com.e104.reciplay.repository.CourseRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class CourseQueryServiceImpl implements CourseQueryService{
    private final CourseRepository courseRepository;
    @Override
    public Course queryCourseById(Long id) {
        return courseRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("존재하지 않는 강좌 ID 입니다."));
    }
}
