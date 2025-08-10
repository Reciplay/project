package com.e104.reciplay.repository.custom;

public interface CustomReviewRepository {
    Double avgStarsByCourseId(Long courseId);
    Double avgInstructorStarsByInstructorId(Long instructorId);

    Integer countInstructorTotalReviewByInstructorId(Long instructorId);
}
