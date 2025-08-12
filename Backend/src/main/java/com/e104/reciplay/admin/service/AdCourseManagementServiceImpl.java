package com.e104.reciplay.admin.service;

import com.e104.reciplay.admin.dto.request.ApprovalInfo;
import com.e104.reciplay.entity.Course;
import com.e104.reciplay.entity.Instructor;
import com.e104.reciplay.livekit.service.depends.CourseQueryService;
import com.e104.reciplay.livekit.service.depends.InstructorQueryService;
import com.e104.reciplay.repository.CourseRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class AdCourseManagementServiceImpl implements AdCourseManagementService{
    private final InstructorQueryService instructorQueryService;
    private final CourseQueryService courseQueryService;
    private final CourseRepository courseRepository;
    private final MessageManagementService messageManagementService;

    @Override
    public void updateCourseApproval(ApprovalInfo approvalInfo, Long adminUserId) {
        if (approvalInfo.getCourseId() == null || approvalInfo.getIsApprove() == null) {
            throw new IllegalArgumentException("잘못된 approvalInfo 입니다.");
        }

        Course course =courseQueryService.queryCourseById(approvalInfo.getCourseId());
        if(course == null){
            throw new EntityNotFoundException("해당 강좌를 찾을 수 없습니다.");
        }

        String content;
        Long instructorUserId = instructorQueryService.queryInstructorById(approvalInfo.getInstructorId()).getUserId();

        if(approvalInfo.getIsApprove()) {
            courseRepository.updateCourseApprovalById(approvalInfo.getCourseId());
            content = course.getTitle() + " 강좌 등록이 승인되었습니다.";
            messageManagementService.createMessage(adminUserId, instructorUserId, content);
        }else{
            courseRepository.deleteById(approvalInfo.getCourseId());
            content = "강좌 등록이 거절되었습니다.\n거절 사유 : " + approvalInfo.getMessage();
            messageManagementService.createMessage(adminUserId, instructorUserId, content);
        }

    }
}
