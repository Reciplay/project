package com.e104.reciplay.admin.service;

import com.e104.reciplay.admin.dto.request.ApprovalInfo;
import com.e104.reciplay.course.courses.service.SubFileMetadataQueryService;
import com.e104.reciplay.course.lecture.service.LectureQueryService;
import com.e104.reciplay.entity.Course;
import com.e104.reciplay.livekit.service.depends.CourseQueryService;
import com.e104.reciplay.livekit.service.depends.InstructorQueryService;
import com.e104.reciplay.repository.CourseRepository;
import com.e104.reciplay.s3.service.S3Service;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
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
    private final LectureQueryService lectureQueryService;
    private final S3Service s3Service;
    private final SubFileMetadataQueryService subFileMetadataQueryService;

    @Override
    @Transactional
    public void updateCourseApproval(ApprovalInfo approvalInfo, Long adminUserId) {
        if (approvalInfo.getCourseId() == null || approvalInfo.getIsApprove() == null) {
            throw new IllegalArgumentException("잘못된 approvalInfo 입니다.");
        }

        Course course =courseQueryService.queryCourseById(approvalInfo.getCourseId());
        if(course == null){
            throw new EntityNotFoundException("해당 강좌를 찾을 수 없습니다.");
        }
        log.debug("예외 통과");
        String content;
        Long instructorUserId = instructorQueryService.queryInstructorById(approvalInfo.getInstructorId()).getUserId();

        if(approvalInfo.getIsApprove()) {
            log.debug("강좌 등록 승인 처리");
            courseRepository.updateCourseApprovalById(approvalInfo.getCourseId());
            log.debug("강좌 등록 수락 알림처리");
            content = course.getTitle() + " 강좌 등록이 승인되었습니다.";
            messageManagementService.createMessage(adminUserId, instructorUserId, content);
        }else{
            log.debug("강좌 등록 거절 처리");
            courseRepository.deleteById(approvalInfo.getCourseId());
            // 강의, chapter, 투두, 강의 자료, 이런걸 배울 수 있어요 삭제 코드 요망
            log.debug("강좌 등록 거절 알림처리");
            content = "강좌 등록이 거절되었습니다.\n거절 사유 : " + approvalInfo.getMessage();
            messageManagementService.createMessage(adminUserId, instructorUserId, content);
        }

    }
}
