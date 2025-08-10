package com.e104.reciplay.course.enrollment.service;

public interface EnrollmentManagementService {
    void enroll(Long courseId, String email);

    void cancle(Long courseId, String email);
}
