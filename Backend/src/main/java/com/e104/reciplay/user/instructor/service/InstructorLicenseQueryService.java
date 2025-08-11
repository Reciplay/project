package com.e104.reciplay.user.instructor.service;

import com.e104.reciplay.entity.InstructorLicense;

import java.util.List;

public interface InstructorLicenseQueryService {
    List<InstructorLicense> queryLicensesByInstructorId(Long instructorId);
}
