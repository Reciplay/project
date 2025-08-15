package com.e104.reciplay.admin.service;

import com.e104.reciplay.admin.dto.request.ApprovalInfo;
import com.e104.reciplay.repository.InstructorRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class AdInstructorManagementServiceImpl implements AdInstructorManagementService{
    private final InstructorRepository instructorRepository;
    private final AdUserManagementService adUserManagementService;
    private final MessageManagementService messageManagementService;
    @Override
    @Transactional
    public void updateInstructorApproval(ApprovalInfo approvalInfo, Long adminUserId) {
        Long instructorUserId = instructorRepository.findById(approvalInfo.getInstructorId()).orElseThrow(() -> new EntityNotFoundException("해당 강사를 찾을 수 없습니다.")).getUserId();
       String content;
        // 강사 등록 승인 시
        if(approvalInfo.getIsApprove()){
            log.debug("강사 등록 거절 처리");
            instructorRepository.updateInstructorApprovalByInstructorId(approvalInfo.getInstructorId());
            adUserManagementService.updateUserRoleToInstructor(instructorUserId);
            content = "강사 등록 승인되었습니다.";
            messageManagementService.createMessage(adminUserId, instructorUserId, content);
        }
        // 강사 등록 거절 시
        else {
            log.debug("강사 등록 거절 처리");
            instructorRepository.deleteById(approvalInfo.getInstructorId());
            content = "강사 등록이 거절되었습니다.\n거절 사유 :"+approvalInfo.getMessage();
            messageManagementService.createMessage(adminUserId, instructorUserId, content);
        }
    }
}
