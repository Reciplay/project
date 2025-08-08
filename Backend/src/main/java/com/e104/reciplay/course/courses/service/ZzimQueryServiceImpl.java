package com.e104.reciplay.course.courses.service;

import com.e104.reciplay.course.courses.repository.ZzimRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ZzimQueryServiceImpl implements ZzimQueryService{
    private final ZzimRepository zzimRepository;
    @Override
    public Boolean isZzimed(Long courseId, Long userId) {
        return zzimRepository.existsByCourseIdAndUserId(courseId, userId);
    }
}
