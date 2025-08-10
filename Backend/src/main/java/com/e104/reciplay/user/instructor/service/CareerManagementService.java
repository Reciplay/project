package com.e104.reciplay.user.instructor.service;

import com.e104.reciplay.entity.Career;

public interface CareerManagementService {
    void saveCareer(Career career);
    void deleteCareersByInstructorId(Long instructorId);
}
