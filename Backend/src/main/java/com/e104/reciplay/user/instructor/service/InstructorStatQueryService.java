package com.e104.reciplay.user.instructor.service;

public interface InstructorStatQueryService {
    Integer queryTotalStudents(Long instructorId);
    Double queryAvgStars(Long instructorId);
}
