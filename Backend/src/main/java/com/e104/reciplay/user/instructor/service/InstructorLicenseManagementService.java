package com.e104.reciplay.user.instructor.service;

import com.e104.reciplay.entity.InstructorLicense;

public interface InstructorLicenseManagementService {
    void saveInstructorLicense(InstructorLicense instructorLicense);
    void deleteInstrutorLicensesByInstructorId(Long instructorId);
}
