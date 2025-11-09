package com.e104.reciplay.user.instructor.controller;

import com.e104.reciplay.livekit.service.depends.InstructorQueryService;
import com.e104.reciplay.user.instructor.dto.request.InstructorApplicationRequest;
import com.e104.reciplay.user.instructor.dto.request.InstructorProfileUpdateRequest;
import com.e104.reciplay.user.instructor.dto.response.InstructorProfile;
import com.e104.reciplay.user.instructor.dto.response.InstructorStat;
import com.e104.reciplay.user.instructor.dto.response.TrendResponse;
import com.e104.reciplay.user.instructor.service.InstructorManagementService;
import com.e104.reciplay.user.security.domain.User;
import com.e104.reciplay.user.security.util.AuthenticationUtil;
import com.e104.reciplay.user.security.service.UserQueryService;
import com.e104.reciplay.entity.Instructor;
import com.e104.reciplay.user.instructor.dto.response.TrendPoint;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.*;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.MockedStatic;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.junit.jupiter.api.Disabled;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.time.LocalDate;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)

class InstructorApiControllerTest {

    private MockMvc mockMvc;

    private UserQueryService userQueryService;
    private InstructorManagementService instructorManagementService;
    private InstructorQueryService instructorQueryService;

    private ObjectMapper objectMapper;
    private MockedStatic<AuthenticationUtil> authStatic;

    @BeforeEach
    void setup() {
        userQueryService = Mockito.mock(UserQueryService.class);
        instructorManagementService = Mockito.mock(InstructorManagementService.class);
        instructorQueryService = Mockito.mock(InstructorQueryService.class);

        InstructorApiController controller = new InstructorApiController(
                userQueryService, instructorManagementService, instructorQueryService
        );

        mockMvc = MockMvcBuilders.standaloneSetup(controller).build();
        objectMapper = new ObjectMapper();
        authStatic = Mockito.mockStatic(AuthenticationUtil.class);
    }

    @AfterEach
    void tearDown() {
        if (authStatic != null) authStatic.close();
    }

    @Test
    @DisplayName("GET /api/v1/user/instructor/profile - 성공")
    void getInstructorProfile_success() throws Exception {
        String email = "tester@example.com";
        Long userId = 10L;
        Long instructorIdParam = 5L;

        authStatic.when(AuthenticationUtil::getSessionUsername).thenReturn(email);

        User mockUser = Mockito.mock(User.class);
        when(mockUser.getId()).thenReturn(userId);
        when(userQueryService.queryUserByEmail(email)).thenReturn(mockUser);

        InstructorProfile profile = InstructorProfile.builder().build();
        when(instructorQueryService.queryInstructorProfile(instructorIdParam, userId)).thenReturn(profile);

        mockMvc.perform(
                get("/api/v1/user/instructor/profile")
                        .param("instructorId", String.valueOf(instructorIdParam))
                        .accept(MediaType.APPLICATION_JSON)
        ).andExpect(status().isOk());

        verify(userQueryService).queryUserByEmail(email);
        verify(instructorQueryService).queryInstructorProfile(instructorIdParam, userId);
        verifyNoMoreInteractions(userQueryService, instructorQueryService, instructorManagementService);
    }

    @Test
    @DisplayName("PUT /api/v1/user/instructor/profile - 멀티파트 성공")
    void updateInstructorProfile_success() throws Exception {
        String email = "instructor@example.com";
        Long instructorId = 7L;

        authStatic.when(AuthenticationUtil::getSessionUsername).thenReturn(email);
        when(instructorQueryService.queryInstructorIdByEmail(email)).thenReturn(instructorId);

        MockMultipartFile coverImage =
                new MockMultipartFile("coverImage", "cover.png", "image/png", "fake-image".getBytes());

        InstructorProfileUpdateRequest updateReq = InstructorProfileUpdateRequest.builder().build();
        MockMultipartFile profileInfo =
                new MockMultipartFile("profileInfo", "", "application/json",
                        objectMapper.writeValueAsBytes(updateReq));

        mockMvc.perform(
                MockMvcRequestBuilders.multipart(HttpMethod.PUT, "/api/v1/user/instructor/profile")
                        .file(coverImage)
                        .file(profileInfo)
                        .contentType(MediaType.MULTIPART_FORM_DATA)
                        .accept(MediaType.APPLICATION_JSON)
        ).andExpect(status().isOk());

        verify(instructorQueryService).queryInstructorIdByEmail(email);
        verify(instructorManagementService).updateInstructor(eq(instructorId), any(InstructorProfileUpdateRequest.class), any());
        verifyNoMoreInteractions(userQueryService, instructorQueryService, instructorManagementService);
    }

    @Test
    @DisplayName("POST /api/v1/user/instructor - 강사 등록 성공")
    void applyForInstructorRole_success() throws Exception {
        String email = "applicant@example.com";
        Long userId = 42L;

        authStatic.when(AuthenticationUtil::getSessionUsername).thenReturn(email);

        User mockUser = Mockito.mock(User.class);
        when(mockUser.getId()).thenReturn(userId);
        when(userQueryService.queryUserByEmail(email)).thenReturn(mockUser);

        MockMultipartFile coverImage =
                new MockMultipartFile("coverImage", "banner.jpg", "image/jpeg", "fake".getBytes());

        InstructorApplicationRequest appReq = InstructorApplicationRequest.builder().build();
        MockMultipartFile instructorProfile =
                new MockMultipartFile("instructorProfile", "", "application/json",
                        objectMapper.writeValueAsBytes(appReq));

        mockMvc.perform(
                MockMvcRequestBuilders.multipart("/api/v1/user/instructor")
                        .file(coverImage)
                        .file(instructorProfile)
                        .contentType(MediaType.MULTIPART_FORM_DATA)
                        .accept(MediaType.APPLICATION_JSON)
        ).andExpect(status().isOk());

        verify(userQueryService).queryUserByEmail(email);
        verify(instructorManagementService).registerInstructor(eq(userId), any(InstructorApplicationRequest.class), any());
        verifyNoMoreInteractions(userQueryService, instructorQueryService, instructorManagementService);
    }

    @Test
    @DisplayName("GET /api/v1/user/instructor/statistic - 성공")
    void getInstructorStatistic_success() throws Exception {
        String email = "insta@example.com";
        Long instructorId = 88L;

        authStatic.when(AuthenticationUtil::getSessionUsername).thenReturn(email);
        when(instructorQueryService.queryInstructorIdByEmail(email)).thenReturn(instructorId);

        InstructorStat stat = InstructorStat.builder().build();
        when(instructorQueryService.queryInstructorStatistic(instructorId)).thenReturn(stat);

        mockMvc.perform(
                get("/api/v1/user/instructor/statistic")
                        .accept(MediaType.APPLICATION_JSON)
        ).andExpect(status().isOk());

        verify(instructorQueryService).queryInstructorIdByEmail(email);
        verify(instructorQueryService).queryInstructorStatistic(instructorId);
        verifyNoMoreInteractions(userQueryService, instructorQueryService, instructorManagementService);
    }

    @Test
    @DisplayName("GET /api/v1/user/instructor/subscriber - 구독자 추이 조회 성공")
    void getInstructorSubscriberStat_success() throws Exception {
        String email = "trendtester@example.com";
        Long instructorId = 33L;
        String criteria = "month";

        authStatic.when(AuthenticationUtil::getSessionUsername).thenReturn(email);

        Instructor mockInstructor = Instructor.builder()
                .id(instructorId)
                .isApproved(true)
                .build();

        TrendResponse mockTrendResponse = TrendResponse.builder()
                .criteria(criteria)
                .from(LocalDate.now().minusMonths(12))
                .to(LocalDate.now())
                .series(List.of(new TrendPoint(LocalDate.of(2024, 9, 1), 50L)))
                .build();

        when(instructorQueryService.queryInstructorByEmail(email)).thenReturn(mockInstructor);
        when(instructorQueryService.querySubscriberTrends(criteria, instructorId)).thenReturn(mockTrendResponse);

        mockMvc.perform(
                get("/api/v1/user/instructor/subscriber")
                        .param("criteris", criteria) // 주의: "criteris" 오타 유지 필요
                        .accept(MediaType.APPLICATION_JSON)
        ).andExpect(status().isOk());

        verify(instructorQueryService).queryInstructorByEmail(email);
        verify(instructorQueryService).querySubscriberTrends(criteria, instructorId);
        verifyNoMoreInteractions(instructorQueryService);
    }
}
