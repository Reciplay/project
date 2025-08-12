package com.e104.reciplay.admin.service;

import com.e104.reciplay.admin.dto.request.ApprovalInfo;
import com.e104.reciplay.entity.Course;
import com.e104.reciplay.entity.Instructor;
import com.e104.reciplay.livekit.service.depends.CourseQueryService;
import com.e104.reciplay.livekit.service.depends.InstructorQueryService;
import com.e104.reciplay.repository.CourseRepository;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AdCourseManagementServiceImplTest {

    @Mock InstructorQueryService instructorQueryService;
    @Mock CourseQueryService courseQueryService;
    @Mock CourseRepository courseRepository;
    @Mock MessageManagementService messageManagementService;

    @InjectMocks
    AdCourseManagementServiceImpl service;

    @Nested
    @DisplayName("예외 케이스")
    class ExceptionCases {

        @Test
        @DisplayName("ApprovalInfo의 필수값 누락 시 IllegalArgumentException")
        void invalidApprovalInfoThrowsIllegalArgument() {
            ApprovalInfo info = mock(ApprovalInfo.class);

            // ✅ 하나만 null로 명시 (이 라인만 있으면 OR 조건으로 바로 IllegalArgumentException)
            given(info.getCourseId()).willReturn(null);

            IllegalArgumentException ex =
                    assertThrows(IllegalArgumentException.class,
                            () -> service.updateCourseApproval(info, 1L));

            assertTrue(ex.getMessage().contains("잘못된 approvalInfo"));
            verifyNoInteractions(courseQueryService, instructorQueryService, courseRepository, messageManagementService);
        }

        @Test
        @DisplayName("강좌가 존재하지 않으면 EntityNotFoundException")
        void courseNotFoundThrowsEntityNotFound() {
            ApprovalInfo info = mock(ApprovalInfo.class);
            given(info.getCourseId()).willReturn(10L);
            given(info.getIsApprove()).willReturn(true);

            // 강좌 조회 결과 없음
            given(courseQueryService.queryCourseById(10L)).willReturn(null);

            EntityNotFoundException ex =
                    assertThrows(EntityNotFoundException.class,
                            () -> service.updateCourseApproval(info, 99L));

            assertTrue(ex.getMessage().contains("해당 강좌를 찾을 수 없습니다."));
            verify(courseQueryService, times(1)).queryCourseById(10L);
            verifyNoMoreInteractions(courseQueryService);
            verifyNoInteractions(instructorQueryService, courseRepository, messageManagementService);
        }
    }

    @Nested
    @DisplayName("승인/거절 플로우")
    class ApproveRejectFlows {

        @Test
        @DisplayName("승인(true) 시: updateCourseApprovalById + 승인 메시지 전송, deleteById는 호출 안 됨")
        void approveFlow() {
            // given
            long adminUserId = 500L;
            long courseId = 20L;
            long instructorId = 7L;
            long instructorUserId = 300L;

            ApprovalInfo info = mock(ApprovalInfo.class);
            given(info.getCourseId()).willReturn(courseId);
            given(info.getIsApprove()).willReturn(true);
            given(info.getInstructorId()).willReturn(instructorId);

            Course course = mock(Course.class);
            given(course.getTitle()).willReturn("스프링 핵심 원리");
            given(courseQueryService.queryCourseById(courseId)).willReturn(course);

            Instructor instructor = mock(Instructor.class);
            given(instructor.getUserId()).willReturn(instructorUserId);
            given(instructorQueryService.queryInstructorById(instructorId)).willReturn(instructor);

            // when
            service.updateCourseApproval(info, adminUserId);

            // then
            verify(courseRepository, times(1)).updateCourseApprovalById(courseId);
            verify(courseRepository, never()).deleteById(anyLong());

            ArgumentCaptor<String> contentCap = ArgumentCaptor.forClass(String.class);
            verify(messageManagementService, times(1))
                    .createMessage(eq(adminUserId), eq(instructorUserId), contentCap.capture());

            String content = contentCap.getValue();
            assertTrue(content.contains("스프링 핵심 원리"));
            assertTrue(content.contains("승인되었습니다"));
        }

        @Test
        @DisplayName("거절(false) 시: deleteById + 거절 사유 포함 메시지 전송, updateCourseApprovalById는 호출 안 됨")
        void rejectFlow() {
            // given
            long adminUserId = 501L;
            long courseId = 21L;
            long instructorId = 8L;
            long instructorUserId = 301L;

            ApprovalInfo info = mock(ApprovalInfo.class);
            given(info.getCourseId()).willReturn(courseId);
            given(info.getIsApprove()).willReturn(false);
            given(info.getInstructorId()).willReturn(instructorId);
            given(info.getMessage()).willReturn("커리큘럼 보완 필요");

            Course course = mock(Course.class);
            given(courseQueryService.queryCourseById(courseId)).willReturn(course); // 존재만 확인

            Instructor instructor = mock(Instructor.class);
            given(instructor.getUserId()).willReturn(instructorUserId);
            given(instructorQueryService.queryInstructorById(instructorId)).willReturn(instructor);

            // when
            service.updateCourseApproval(info, adminUserId);

            // then
            verify(courseRepository, times(1)).deleteById(courseId);
            verify(courseRepository, never()).updateCourseApprovalById(anyLong());

            ArgumentCaptor<String> contentCap = ArgumentCaptor.forClass(String.class);
            verify(messageManagementService, times(1))
                    .createMessage(eq(adminUserId), eq(instructorUserId), contentCap.capture());

            String content = contentCap.getValue();
            assertTrue(content.contains("거절되었습니다"));
            assertTrue(content.contains("거절 사유"));
            assertTrue(content.contains("커리큘럼 보완 필요"));
        }
    }
}
