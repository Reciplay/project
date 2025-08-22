package com.e104.reciplay.user.instructor.service;

import com.e104.reciplay.user.instructor.dto.request.InstructorApplicationRequest;
import com.e104.reciplay.user.instructor.dto.request.InstructorProfileUpdateRequest;
import org.springframework.web.multipart.MultipartFile;

public interface InstructorManagementService {
    void registerInstructor(Long userId, InstructorApplicationRequest request, MultipartFile coverImage);

    void updateInstructor(Long instructorId, InstructorProfileUpdateRequest request, MultipartFile coverImage);

}
