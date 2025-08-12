package com.e104.reciplay.admin.service;

import com.e104.reciplay.admin.dto.request.ApprovalInfo;
import com.e104.reciplay.entity.Instructor;
import com.e104.reciplay.repository.InstructorRepository;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AdInstructorManagementServiceImplTest {

    @Mock InstructorRepository instructorRepository;
    @Mock AdUserManagementService adUserManagementService;
    @Mock MessageManagementService messageManagementService;

    @InjectMocks
    AdInstructorManagementServiceImpl service;

    @Nested
    @DisplayName("예외 케이스")
    class ExceptionCases {

        @Test
        @DisplayName("강사 미존재 시 EntityNotFoundException")
        void instructorNotFoundThrows() {
            long instructorId = 100L;
            ApprovalInfo info = mock(ApprovalInfo.class);
            given(info.getInstructorId()).willReturn(instructorId);

            given(instructorRepository.findById(instructorId)).willReturn(Optional.empty());

            assertThrows(EntityNotFoundException.class,
                    () -> service.updateInstructorApproval(info, 999L));

            verify(instructorRepository, times(1)).findById(instructorId);
            verifyNoInteractions(adUserManagementService, messageManagementService);
        }
    }

    @Nested
    @DisplayName("승인/거절 플로우")
    class ApproveRejectFlows {

        @Test
        @DisplayName("승인(true): update + 역할변경 + 승인 메시지, delete 호출 안됨")
        void approveFlow() {
            long adminUserId = 900L;
            long instructorId = 10L;
            long instructorUserId = 777L;

            ApprovalInfo info = mock(ApprovalInfo.class);
            given(info.getInstructorId()).willReturn(instructorId);
            given(info.getIsApprove()).willReturn(true);

            Instructor instructor = mock(Instructor.class);
            given(instructor.getUserId()).willReturn(instructorUserId);
            given(instructorRepository.findById(instructorId)).willReturn(Optional.of(instructor));

            service.updateInstructorApproval(info, adminUserId);

            verify(instructorRepository, times(1)).findById(instructorId);
            verify(instructorRepository, times(1)).updateInstructorApprovalByInstructorId(instructorId);
            verify(instructorRepository, never()).deleteById(anyLong());

            verify(adUserManagementService, times(1)).updateUserRoleToInstructor(instructorUserId);

            ArgumentCaptor<String> contentCap = ArgumentCaptor.forClass(String.class);
            verify(messageManagementService, times(1))
                    .createMessage(eq(adminUserId), eq(instructorUserId), contentCap.capture());

            String content = contentCap.getValue();
            assertTrue(content.contains("강사 등록 승인되었습니다"));
        }

        @Test
        @DisplayName("거절(false): delete + 거절 사유 메시지, update/역할변경 호출 안됨")
        void rejectFlow() {
            long adminUserId = 901L;
            long instructorId = 11L;
            long instructorUserId = 778L;

            ApprovalInfo info = mock(ApprovalInfo.class);
            given(info.getInstructorId()).willReturn(instructorId);
            given(info.getIsApprove()).willReturn(false);
            given(info.getMessage()).willReturn("자격 요건 미충족");

            Instructor instructor = mock(Instructor.class);
            given(instructor.getUserId()).willReturn(instructorUserId);
            given(instructorRepository.findById(instructorId)).willReturn(Optional.of(instructor));

            service.updateInstructorApproval(info, adminUserId);

            verify(instructorRepository, times(1)).findById(instructorId);
            verify(instructorRepository, times(1)).deleteById(instructorId);
            verify(instructorRepository, never()).updateInstructorApprovalByInstructorId(anyLong());

            verify(adUserManagementService, never()).updateUserRoleToInstructor(anyLong());

            ArgumentCaptor<String> contentCap = ArgumentCaptor.forClass(String.class);
            verify(messageManagementService, times(1))
                    .createMessage(eq(adminUserId), eq(instructorUserId), contentCap.capture());

            String content = contentCap.getValue();
            assertTrue(content.contains("강사 등록이 거절되었습니다"));
            assertTrue(content.contains("거절 사유"));
            assertTrue(content.contains("자격 요건 미충족"));
        }
    }
}
