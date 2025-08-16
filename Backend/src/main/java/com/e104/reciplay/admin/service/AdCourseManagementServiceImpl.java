package com.e104.reciplay.admin.service;

import com.e104.reciplay.admin.dto.request.ApprovalInfo;
import com.e104.reciplay.course.courses.service.CanLearnManagementService;
import com.e104.reciplay.course.courses.service.CanLearnQueryService;
import com.e104.reciplay.course.courses.service.SubFileMetadataQueryService;
import com.e104.reciplay.course.lecture.service.*;
import com.e104.reciplay.entity.*;
import com.e104.reciplay.livekit.service.depends.CourseQueryService;
import com.e104.reciplay.livekit.service.depends.InstructorQueryService;
import com.e104.reciplay.repository.CourseRepository;
import com.e104.reciplay.s3.service.FileMetadataQueryService;
import com.e104.reciplay.s3.service.S3Service;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import jdk.swing.interop.LightweightContentWrapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

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

    private final FileMetadataQueryService fileMetadataQueryService;

    private final ChapterQueryService chapterQueryService;

    private final TodoQueryService todoQueryService;

    private final CanLearnManagementService canLearnManagementService;

    private final ChapterManagementService chapterManagementService;

    private final TodoManagementService todoManagementService;

    private final LectureManagementService lectureManagementService;

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
            this.cleanCourseInfos(course.getId());
            // 강의, chapter, 투두, 강의 자료, 이런걸 배울 수 있어요 삭제 코드 요망
            log.debug("강좌 등록 거절 알림처리");
            content = "강좌 등록이 거절되었습니다.\n거절 사유 : " + approvalInfo.getMessage();
            messageManagementService.createMessage(adminUserId, instructorUserId, content);
        }
    }

    private void cleanCourseInfos(Long courseId) {
        // 1. 강좌 -
        // 2. 강의 -
        // 3. 챕터 -
        // 4. TODOS -
        // 5. 자료 -
        // 6. canLeans -

        List<Long> lectureTargets = lectureQueryService.queryLecturesByCourseId(courseId)
                .stream().map(Lecture::getId).toList();

        List<Long> chapterTargets = new ArrayList<>();

        for(Long lectureId : lectureTargets) {
            try {
                FileMetadata metadata = fileMetadataQueryService.queryLectureMaterial(lectureId);
                s3Service.deleteFile(metadata);
            } catch (Exception e) {
                log.debug("강좌 제거 과정. 파일 제거중 오류 발생함. {}", e.getMessage());
            }

            chapterTargets.addAll(chapterQueryService.queryChaptersByLectureId(lectureId)
                    .stream().map(Chapter::getId).toList());
        }

        int cnt = canLearnManagementService.deleteCanLearnsByCourseId(courseId);
        log.debug("이런것도 배울수 있어요 삭제 : {}", cnt);

        cnt = todoManagementService.deleteAllTodosByChapterIds(chapterTargets);
        log.debug("투두 리스트 삭제 : {}", cnt);

        cnt = chapterManagementService.deleteAllChaptersByLectureIds(lectureTargets);
        log.debug("챕터 삭제 : {}", cnt);

        cnt = lectureManagementService.deleteAllLecturesByCourseId(courseId);
        log.debug("강의 삭제");

        courseRepository.deleteById(courseId);
    }
}
