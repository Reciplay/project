package com.e104.reciplay.user.instructor.service;

import com.e104.reciplay.entity.InstructorLicense;
import com.e104.reciplay.user.instructor.repository.InstructorLicenseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class InstructorLicenseManagementServiceImpl implements InstructorLicenseManagementService{
   private final InstructorLicenseRepository instructorLicenseRepository;
    @Override
    public void saveInstructorLicense(InstructorLicense instructorLicense) {
        instructorLicenseRepository.save(instructorLicense);
    }

    @Override
    public void deleteInstrutorLicensesByInstructorId(Long instructorId) {
        instructorLicenseRepository.deleteAllByInstructorId(instructorId);
    }
}
