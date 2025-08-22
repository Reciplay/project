package com.e104.reciplay.admin.service;

import com.e104.reciplay.admin.dto.response.AdCourseDetail;
import com.e104.reciplay.admin.dto.response.AdCourseSummary;

import java.util.List;

public interface AdCourseQueryService {
    List<AdCourseSummary> queryAdCourseSummary(Boolean isApprove);

    AdCourseDetail queryCourseDetail(Long courseId);
}
