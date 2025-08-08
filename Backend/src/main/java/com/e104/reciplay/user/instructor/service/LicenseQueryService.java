package com.e104.reciplay.user.instructor.service;

import com.e104.reciplay.entity.License;
import com.e104.reciplay.user.instructor.dto.request.LicenseSummary;

import java.util.List;

public interface LicenseQueryService {
    List<LicenseSummary> queryLicenseList();
    License queryLicenseById(Long id);
}
