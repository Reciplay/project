package com.e104.reciplay.user.instructor.service;

import com.e104.reciplay.entity.Career;

import java.util.List;

public interface CareerQueryService {
    List<Career> queryCarrersByInstructorId(Long instructorId);
}
