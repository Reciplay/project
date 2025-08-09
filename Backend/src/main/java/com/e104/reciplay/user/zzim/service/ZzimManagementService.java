package com.e104.reciplay.user.zzim.service;

public interface ZzimManagementService {
    void zzimCourse(Long courseId, String email);
    void unzzimCourse(Long courseId, String email);
}
