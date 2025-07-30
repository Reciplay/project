
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
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(AdminApiController.class)
@AutoConfigureMockMvc(addFilters = false)
class AdminApiControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @DisplayName("강사 요약 정보 리스트 조회")
    void getInstructorSummaries() throws Exception {
        mockMvc.perform(get("/api/v1/course/admin/instructor/summaries")
                        .param("isApprove", "true"))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("강사 상세 정보 조회")
    void getInstructorDetail() throws Exception {
        mockMvc.perform(get("/api/v1/course/admin/instructor")
                        .param("instructorId", "1"))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("강사 등록 수락/거절")
    void handleInstructorRegistration() throws Exception {
        ApprovalInfo approvalInfo = new ApprovalInfo();
        mockMvc.perform(put("/api/v1/course/admin/instructor")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(approvalInfo)))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("강좌 요약 정보 리스트 조회")
    void getCourseSummaries() throws Exception {
        mockMvc.perform(get("/api/v1/course/admin/course/summaries")
                        .param("isApprove", "true"))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("강좌 상세 정보 조회")
    void getCourseDetail() throws Exception {
        mockMvc.perform(get("/api/v1/course/admin/course")
                        .param("courseId", "1"))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("강좌 등록 수락/거절")
    void handleCourseRegistration() throws Exception {
        ApprovalInfo approvalInfo = new ApprovalInfo();
        mockMvc.perform(put("/api/v1/course/admin/course")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(approvalInfo)))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("일반 회원 요약 정보 리스트 조회")
    void getUserSummaries() throws Exception {
        mockMvc.perform(get("/api/v1/course/admin/user/summaries"))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("일반 회원 상세 정보 조회")
    void getUserDetail() throws Exception {
        mockMvc.perform(get("/api/v1/course/admin/user")
                        .param("userId", "1"))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("회원 탈퇴")
    void deleteUser() throws Exception {
        mockMvc.perform(delete("/api/v1/course/admin/user")
                        .param("userId", "1"))
                .andExpect(status().isOk());
    }
}
