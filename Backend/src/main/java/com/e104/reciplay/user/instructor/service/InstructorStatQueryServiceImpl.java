package com.e104.reciplay.user.instructor.service;

import com.e104.reciplay.repository.CourseHistoryRepository;
import com.e104.reciplay.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class InstructorStatQueryServiceImpl implements  InstructorStatQueryService{
    private final CourseHistoryRepository courseHistoryRepository;
    private final ReviewRepository reviewRepository;
    @Override
    public Integer queryTotalStudents(Long instructorId) {
        return courseHistoryRepository.countInstructorTotalStudentsByInstructorId(instructorId);
    }

    @Override
    public Double queryAvgStars(Long instructorId) {
        return reviewRepository.avgInstructorStarsByInstructorId(instructorId);
    }
}
