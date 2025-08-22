package com.e104.reciplay.repository.custom;

import com.e104.reciplay.admin.dto.response.AdInstructorDetail;
import com.e104.reciplay.admin.dto.response.AdInstructorSummary;

import java.util.List;

public interface CustomInstructorRepository {
    Long findIdByEmail(String email);

    String findNameById(Long id);

    List<AdInstructorSummary>  findAdInstructorSummariesByIsApprove(Boolean isApprove);
    AdInstructorDetail findAdInstructorDetailByInstructorId(Long instructorId);

    void updateInstructorApprovalByInstructorId(Long InstructorId);
}
