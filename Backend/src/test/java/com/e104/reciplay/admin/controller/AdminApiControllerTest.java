package com.e104.reciplay.admin.controller;

import com.e104.reciplay.admin.dto.request.ApprovalInfo;
import com.e104.reciplay.admin.dto.response.AdCourseDetail;
import com.e104.reciplay.admin.dto.response.AdInstructorDetail;
import com.e104.reciplay.admin.dto.response.AdUserDetail;
import com.e104.reciplay.admin.service.*;
import com.e104.reciplay.user.security.domain.User;
import com.e104.reciplay.user.security.service.UserQueryService;
import com.e104.reciplay.user.security.util.AuthenticationUtil;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockedStatic;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.nio.charset.StandardCharsets;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.lenient;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
class AdminApiControllerTest {

    private MockMvc mockMvc;
    private ObjectMapper objectMapper;

    @InjectMocks
    AdminApiController controller;

    @Mock AdInstructorQueryService adInstructorQueryService;
    @Mock AdInstructorManagementService adInstructorManagementService;
    @Mock AdCourseQueryService adCourseQueryService;
    @Mock AdUserQueryService adUserQueryService;
    @Mock AdUserManagementService adUserManagementService;
    @Mock AdCourseManagementService adCourseManagementService;
    @Mock UserQueryService userQueryService;

    private static final String BASE = "/api/v1/admin";
    private static final String ADMIN_EMAIL = "admin@example.com";

    private User adminMockUser;

    @BeforeEach
    void setUp() {
        objectMapper = new ObjectMapper().registerModule(new JavaTimeModule());
        mockMvc = MockMvcBuilders
                .standaloneSetup(controller)
                .setMessageConverters(new MappingJackson2HttpMessageConverter(objectMapper))
                .build();
    }

    private String instructorApprovalJsonApprove() {
        return """
               { "instructorId": 2, "isApprove": true, "message": "OK" }
               """;
    }

    private String courseApprovalJsonApprove() {
        return """
               { "courseId": 1, "instructorId": 2, "isApprove": true, "message": "OK" }
               """;
    }

    private MockedStatic<AuthenticationUtil> mockAdminRoleOnly() {
        MockedStatic<AuthenticationUtil> mockedStatic = Mockito.mockStatic(AuthenticationUtil.class);
        mockedStatic.when(AuthenticationUtil::getSessionUsername).thenReturn(ADMIN_EMAIL);

        adminMockUser = Mockito.mock(User.class);
        lenient().when(userQueryService.queryUserByEmail(ADMIN_EMAIL)).thenReturn(adminMockUser);

        return mockedStatic;
    }

    @Nested
    @DisplayName("강사 APIs")
    class InstructorApis {

        @Test
        @DisplayName("GET /instructor/summaries - 200 & service 호출 검증")
        void getInstructorSummaries() throws Exception {
            try (MockedStatic<AuthenticationUtil> ignored = mockAdminRoleOnly()) {
                given(adInstructorQueryService.queryAdInstructorSummary(true)).willReturn(List.of());

                mockMvc.perform(get(BASE + "/instructor/summaries").param("isApprove", "true"))
                        .andExpect(status().isOk())
                        .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON));

                verify(adInstructorQueryService, times(1)).queryAdInstructorSummary(true);
            }
        }

        @Test
        @DisplayName("GET /instructor - 200 & service 호출 검증")
        void getInstructorDetail() throws Exception {
            try (MockedStatic<AuthenticationUtil> ignored = mockAdminRoleOnly()) {
                AdInstructorDetail detail = Mockito.mock(AdInstructorDetail.class);
                given(adInstructorQueryService.queryInstructorDetail(10L)).willReturn(detail);

                mockMvc.perform(get(BASE + "/instructor").param("instructorId", "10"))
                        .andExpect(status().isOk())
                        .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON));

                verify(adInstructorQueryService, times(1)).queryInstructorDetail(10L);
            }
        }

        @Test
        @DisplayName("PUT /instructor - 200 & 승인 처리 호출 검증")
        void handleInstructorRegistration() throws Exception {
            try (MockedStatic<AuthenticationUtil> ignored = mockAdminRoleOnly()) {
                given(adminMockUser.getId()).willReturn(99L);

                mockMvc.perform(put(BASE + "/instructor")
                                .contentType(MediaType.APPLICATION_JSON)
                                .characterEncoding(StandardCharsets.UTF_8)
                                .content(instructorApprovalJsonApprove()))
                        .andExpect(status().isOk())
                        .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON));

                verify(userQueryService, times(1)).queryUserByEmail(ADMIN_EMAIL);
                verify(adInstructorManagementService, times(1))
                        .updateInstructorApproval(any(ApprovalInfo.class), Mockito.eq(99L));
            }
        }
    }

    @Nested
    @DisplayName("강좌 APIs")
    class CourseApis {

        @Test
        @DisplayName("GET /course/summaries - 200 & service 호출 검증")
        void getCourseSummaries() throws Exception {
            try (MockedStatic<AuthenticationUtil> ignored = mockAdminRoleOnly()) {
                given(adCourseQueryService.queryAdCourseSummary(false)).willReturn(List.of());

                mockMvc.perform(get(BASE + "/course/summaries").param("isApprove", "false"))
                        .andExpect(status().isOk())
                        .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON));

                verify(adCourseQueryService, times(1)).queryAdCourseSummary(false);
            }
        }

        @Test
        @DisplayName("GET /course - 200 & service 호출 검증")
        void getCourseDetail() throws Exception {
            try (MockedStatic<AuthenticationUtil> ignored = mockAdminRoleOnly()) {
                AdCourseDetail detail = Mockito.mock(AdCourseDetail.class);
                given(adCourseQueryService.queryCourseDetail(7L)).willReturn(detail);

                mockMvc.perform(get(BASE + "/course").param("courseId", "7"))
                        .andExpect(status().isOk())
                        .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON));

                verify(adCourseQueryService, times(1)).queryCourseDetail(7L);
            }
        }

        @Test
        @DisplayName("PUT /course - 200 & 승인 처리 호출 검증")
        void handleCourseRegistration() throws Exception {
            try (MockedStatic<AuthenticationUtil> ignored = mockAdminRoleOnly()) {
                given(adminMockUser.getId()).willReturn(11L);

                mockMvc.perform(put(BASE + "/course")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(courseApprovalJsonApprove()))
                        .andExpect(status().isOk())
                        .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON));

                verify(userQueryService, times(1)).queryUserByEmail(ADMIN_EMAIL);
                verify(adCourseManagementService, times(1))
                        .updateCourseApproval(any(ApprovalInfo.class), Mockito.eq(11L));
            }
        }
    }

    @Nested
    @DisplayName("회원 APIs")
    class UserApis {

        @Test
        @DisplayName("GET /user/summaries - 200 & service 호출 검증")
        void getUserSummaries() throws Exception {
            try (MockedStatic<AuthenticationUtil> ignored = mockAdminRoleOnly()) {
                given(adUserQueryService.queryUserSummaries()).willReturn(List.of());

                mockMvc.perform(get(BASE + "/user/summaries"))
                        .andExpect(status().isOk())
                        .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON));

                verify(adUserQueryService, times(1)).queryUserSummaries();
            }
        }

        @Test
        @DisplayName("GET /user - 200 & service 호출 검증")
        void getUserDetail() throws Exception {
            try (MockedStatic<AuthenticationUtil> ignored = mockAdminRoleOnly()) {
                AdUserDetail detail = Mockito.mock(AdUserDetail.class);
                given(adUserQueryService.queryUserDetail(123L)).willReturn(detail);

                mockMvc.perform(get(BASE + "/user").param("userId", "123"))
                        .andExpect(status().isOk())
                        .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON));

                verify(adUserQueryService, times(1)).queryUserDetail(123L);
            }
        }

        @Test
        @DisplayName("DELETE /user - 200 & 삭제 호출 검증")
        void deleteUser() throws Exception {
            try (MockedStatic<AuthenticationUtil> ignored = mockAdminRoleOnly()) {
                mockMvc.perform(delete(BASE + "/user").param("userId", "77"))
                        .andExpect(status().isOk())
                        .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON));

                verify(adUserManagementService, times(1)).deleteUser(77L);
            }
        }
    }
}
