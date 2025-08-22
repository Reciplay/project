package com.e104.reciplay.user.instructor.service;

import com.e104.reciplay.entity.Career;
import com.e104.reciplay.user.instructor.repository.CareerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CareerManagementServiceImpl implements CareerManagementService{
    private final CareerRepository careerRepository;
    @Override
    public void saveCareer(Career career) {
        careerRepository.save(career);

    }

    @Override
    public void deleteCareersByInstructorId(Long instructorId) {
        careerRepository.deleteAllById(instructorId);
    }
}
