package com.e104.reciplay.admin.controller;

import com.e104.reciplay.admin.dto.request.ApprovalInfo;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(AdminApiController.class)
@AutoConfigureMockMvc(addFilters = false)
class AdminApiControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @DisplayName("강사 요약 정보 리스트 조회 API 테스트")
    void testGetInstructorSummaries() throws Exception {
        mockMvc.perform(get("/api/v1/course/admin/instructor/summary")
                        .param("isApprove", "1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("강사 요약 정보 리스트 조회에 성공하였습니다."));
    }

    @Test
    @DisplayName("강사 상세 정보 조회 API 테스트")
    void testGetInstructorDetail() throws Exception {
        mockMvc.perform(get("/api/v1/course/admin/instructor")
                        .param("instructorId", "1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("강사 상세 정보 조회에 성공하였습니다."));
    }

    @Test
    @DisplayName("강사 상태 변경 API 테스트")
    void testUpdateInstructorStatus() throws Exception {
        ApprovalInfo info = new ApprovalInfo(); // 필요시 필드 채우기
        String content = objectMapper.writeValueAsString(info);

        mockMvc.perform(put("/api/v1/course/admin/instructor")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(content))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("강사 상태(등록 여부) 변경에 성공하였습니다."));
    }

    @Test
    @DisplayName("강좌 요약 정보 리스트 조회 API 테스트")
    void testGetCourseSummaries() throws Exception {
        mockMvc.perform(get("/api/v1/course/admin/course/summary")
                        .param("isApprove", "1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("강좌 요약 정보 리스트 조회에 성공하였습니다."));
    }

    @Test
    @DisplayName("강좌 상세 정보 조회 API 테스트")
    void testGetCourseDetail() throws Exception {
        mockMvc.perform(get("/api/v1/course/admin/course")
                        .param("courseId", "1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("강좌 상세 정보 조회에 성공하였습니다."));
    }

    @Test
    @DisplayName("강좌 상태 변경 API 테스트")
    void testUpdateCourseStatus() throws Exception {
        ApprovalInfo info = new ApprovalInfo(); // 필요시 필드 채우기
        String content = objectMapper.writeValueAsString(info);

        mockMvc.perform(put("/api/v1/course/admin/course")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(content))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("강좌 상태(등록 여부) 변경에 성공하였습니다."));
    }

    @Test
    @DisplayName("일반 회원 요약 정보 리스트 조회 API 테스트")
    void testGetUserSummaries() throws Exception {
        mockMvc.perform(get("/api/v1/course/admin/user/summary"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("일반 회원 요약 정보 리스트 조회에 성공하였습니다."));
    }

    @Test
    @DisplayName("일반 회원 상세 정보 조회 API 테스트")
    void testGetUserDetail() throws Exception {
        mockMvc.perform(get("/api/v1/course/admin/user"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("일반 회원 상세 정보 조회에 성공하였습니다."));
    }

    @Test
    @DisplayName("회원 탈퇴 API 테스트")
    void testDeleteUser() throws Exception {
        mockMvc.perform(delete("/api/v1/course/admin/user")
                        .param("userId", "1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("회원 탈퇴에 성공하였습니다."));
    }
}
