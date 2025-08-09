package com.e104.reciplay.course.courses.service;

import com.e104.reciplay.course.courses.repository.CanLearnRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CanLearnManagementServiceImpl implements CanLearnManagementService{
    private final CanLearnRepository canLearnRepository;
    @Override
    public void createCanLearnsWithCourseId(Long courseId, List<String> canLearns) {
        canLearnRepository.insertCanLearnsWithCourseId(courseId, canLearns);
    }

    @Override
    public void deleteCanLearnsByCourseId(Long courseId) {
        canLearnRepository.deleteAllByCourseId(courseId);
    }
}
