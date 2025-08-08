package com.e104.reciplay.user.instructor.service;

import com.e104.reciplay.entity.License;
import com.e104.reciplay.repository.LicenseRepository;
import com.e104.reciplay.user.instructor.dto.request.LicenseSummary;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class LicenseQueryServiceImpl implements LicenseQueryService {
    private final LicenseRepository licenseRepository;
    @Override
    public List<LicenseSummary> queryLicenseList() {
        return licenseRepository.findAll().stream().map(LicenseSummary::new).toList();
    }

    @Override
    public License queryLicenseById(Long id) {
        return licenseRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("해당하는 자격증 ID가 없습니다."));
    }
}
