package com.e104.reciplay.user.instructor.service;

import com.e104.reciplay.entity.Career;
import com.e104.reciplay.user.instructor.repository.CareerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CarrerQueryServiceImpl implements  CareerQueryService{
    private final CareerRepository careerRepository;
    @Override
    public List<Career> queryCarrersByInstructorId(Long instructorId) {
        return careerRepository.findAllByInstructorId(instructorId);
    }
}
