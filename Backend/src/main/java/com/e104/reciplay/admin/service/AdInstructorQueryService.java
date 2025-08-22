package com.e104.reciplay.admin.service;

import com.e104.reciplay.admin.dto.response.AdInstructorDetail;
import com.e104.reciplay.admin.dto.response.AdInstructorSummary;

import java.util.List;

public interface AdInstructorQueryService {
    List<AdInstructorSummary> queryAdInstructorSummary(Boolean isApprove);
    AdInstructorDetail queryInstructorDetail(Long instructorId);
}
