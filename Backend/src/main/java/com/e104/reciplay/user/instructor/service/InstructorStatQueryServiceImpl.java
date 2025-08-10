package com.e104.reciplay.user.instructor.service;

import com.e104.reciplay.repository.CourseHistoryRepository;
import com.e104.reciplay.repository.ReviewRepository;
import com.e104.reciplay.user.instructor.repository.SubscriptionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class InstructorStatQueryServiceImpl implements  InstructorStatQueryService{
    private final CourseHistoryRepository courseHistoryRepository;
    private final ReviewRepository reviewRepository;
    private final SubscriptionRepository subscriptionRepository;
    @Override
    public Integer queryTotalStudents(Long instructorId) {
        return courseHistoryRepository.countInstructorTotalStudentsByInstructorId(instructorId);
    }

    @Override
    public Double queryAvgStars(Long instructorId) {
        return reviewRepository.avgInstructorStarsByInstructorId(instructorId);
    }

    @Override
    public Integer queryTotalReviewCount(Long instructorId) {
        return reviewRepository.countInstructorTotalReviewByInstructorId(instructorId);
    }

    @Override
    public Integer querySubsciberCount(Long instructorId) {
        return subscriptionRepository.countInstructorSubscriberByInstrcutorId(instructorId);
    }
}
