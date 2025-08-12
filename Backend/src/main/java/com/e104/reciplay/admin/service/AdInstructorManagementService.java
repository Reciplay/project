package com.e104.reciplay.admin.service;

import com.e104.reciplay.admin.dto.request.ApprovalInfo;

public interface AdInstructorManagementService {
    void updateInstructorApproval(ApprovalInfo approvalInfo, Long adminUserId);
}
