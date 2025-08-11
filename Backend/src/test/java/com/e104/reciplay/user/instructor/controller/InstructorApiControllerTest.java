package com.e104.reciplay.user.instructor.controller;

import com.e104.reciplay.livekit.service.depends.InstructorQueryService;
import com.e104.reciplay.user.instructor.dto.request.InstructorApplicationRequest;
import com.e104.reciplay.user.instructor.dto.request.InstructorProfileUpdateRequest;
import com.e104.reciplay.user.instructor.dto.response.InstructorProfile;
import com.e104.reciplay.user.instructor.dto.response.InstructorStat;
import com.e104.reciplay.user.instructor.service.InstructorManagementService;
import com.e104.reciplay.user.security.domain.User;
import com.e104.reciplay.user.security.service.UserQueryService;
import com.e104.reciplay.user.security.util.AuthenticationUtil;
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
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
class InstructorApiControllerTest {

    private MockMvc mockMvc;

    // Services (Mockito mocks)
    private UserQueryService userQueryService;
    private InstructorManagementService instructorManagementService;
    private InstructorQueryService instructorQueryService;

    private ObjectMapper objectMapper;

    private MockedStatic<AuthenticationUtil> authStatic; // static 메서드 mock 핸들러

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

        // static 메서드 mock 시작
        authStatic = Mockito.mockStatic(AuthenticationUtil.class);
    }

    @AfterEach
    void tearDown() {
        if (authStatic != null) authStatic.close(); // static mock 해제
    }

    @Test
    @DisplayName("GET /api/v1/user/instructor/profile - 성공")
    void getInstructorProfile_success() throws Exception {
        // given
        String email = "tester@example.com";
        Long userId = 10L;
        Long instructorIdParam = 5L;

        authStatic.when(AuthenticationUtil::getSessionUsername).thenReturn(email);

        User mockUser = Mockito.mock(User.class);
        when(mockUser.getId()).thenReturn(userId);
        when(userQueryService.queryUserByEmail(email)).thenReturn(mockUser);

        InstructorProfile profile = InstructorProfile.builder().build();
        when(instructorQueryService.queryInstructorProfile(instructorIdParam, userId)).thenReturn(profile);

        // when & then
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
        // given
        String email = "instructor@example.com";
        Long instructorId = 7L;

        authStatic.when(AuthenticationUtil::getSessionUsername).thenReturn(email);
        when(instructorQueryService.queryInstructorIdByEmail(email)).thenReturn(instructorId);

        // 파일 파트
        MockMultipartFile coverImage =
                new MockMultipartFile("coverImage", "cover.png", "image/png", "fake-image".getBytes());

        // JSON 파트
        InstructorProfileUpdateRequest updateReq = InstructorProfileUpdateRequest.builder()
                // .set 필드들 필요 시 설정
                .build();
        MockMultipartFile profileInfo =
                new MockMultipartFile("profileInfo", "", "application/json",
                        objectMapper.writeValueAsBytes(updateReq));

        // when & then
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
        // given
        String email = "applicant@example.com";
        Long userId = 42L;

        authStatic.when(AuthenticationUtil::getSessionUsername).thenReturn(email);

        User mockUser = Mockito.mock(User.class);
        when(mockUser.getId()).thenReturn(userId);
        when(userQueryService.queryUserByEmail(email)).thenReturn(mockUser);

        MockMultipartFile coverImage =
                new MockMultipartFile("coverImage", "banner.jpg", "image/jpeg", "fake".getBytes());

        InstructorApplicationRequest appReq = InstructorApplicationRequest.builder()
                // .set 필드들 필요 시 설정
                .build();
        MockMultipartFile instructorProfile =
                new MockMultipartFile("instructorProfile", "", "application/json",
                        objectMapper.writeValueAsBytes(appReq));

        // when & then
        mockMvc.perform(
                MockMvcRequestBuilders.multipart("/api/v1/user/instructor")
                        .file(coverImage)
                        .file(instructorProfile)
                        .contentType(MediaType.MULTIPART_FORM_DATA)
                        .accept(MediaType.APPLICATION_JSON)
        ).andExpect(status().isOk()); // CommonResponseBuilder.success가 200을 리턴한다고 가정

        verify(userQueryService).queryUserByEmail(email);
        verify(instructorManagementService).registerInstructor(eq(userId), any(InstructorApplicationRequest.class), any());
        verifyNoMoreInteractions(userQueryService, instructorQueryService, instructorManagementService);
    }

    @Test
    @DisplayName("GET /api/v1/user/instructor/statistic - 성공")
    void getInstructorStatistic_success() throws Exception {
        // given
        String email = "insta@example.com";
        Long instructorId = 88L;

        authStatic.when(AuthenticationUtil::getSessionUsername).thenReturn(email);
        when(instructorQueryService.queryInstructorIdByEmail(email)).thenReturn(instructorId);

        InstructorStat stat = InstructorStat.builder().build();
        when(instructorQueryService.queryInstructorStatistic(instructorId)).thenReturn(stat);

        // when & then
        mockMvc.perform(
                get("/api/v1/user/instructor/statistic")
                        .accept(MediaType.APPLICATION_JSON)
        ).andExpect(status().isOk());

        verify(instructorQueryService).queryInstructorIdByEmail(email);
        verify(instructorQueryService).queryInstructorStatistic(instructorId);
        verifyNoMoreInteractions(userQueryService, instructorQueryService, instructorManagementService);
    }
}
