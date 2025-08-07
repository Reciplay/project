package com.e104.reciplay.course.courses.service;

import com.e104.reciplay.course.courses.repository.CanLearnRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class CanLearnQueryServiceImpl implements CanLearnQueryService{
    private final CanLearnRepository canLearnRepository;
    @Override
    public List<String> queryContentsByCourseId(Long courseId) {

        return canLearnRepository.findContentsByCourseId(courseId);
    }
}
