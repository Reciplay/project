package com.e104.reciplay.admin.service;

import com.e104.reciplay.admin.dto.request.ApprovalInfo;

public interface AdCourseManagementService {
    void updateCourseApproval(ApprovalInfo approvalInfo, Long adminUserId);
}
