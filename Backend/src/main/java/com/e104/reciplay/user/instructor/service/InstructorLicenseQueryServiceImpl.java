package com.e104.reciplay.user.instructor.service;

import com.e104.reciplay.entity.InstructorLicense;
import com.e104.reciplay.user.instructor.repository.InstructorLicenseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class InstructorLicenseQueryServiceImpl implements  InstructorLicenseQueryService{
    private InstructorLicenseRepository instructorLicenseRepository;
    @Override
    public List<InstructorLicense> queryLicensesByInstructorId(Long instructorId) {
        return instructorLicenseRepository.findAllByInstructorId(instructorId);
    }

}
