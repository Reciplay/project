package com.e104.reciplay.user.instructor.service;

public interface InstructorStatQueryService {
    Integer queryTotalStudents(Long instructorId);
    Double queryAvgStars(Long instructorId);

    Integer queryTotalReviewCount(Long instructorId);

    Integer querySubsciberCount(Long instructorId);
}
