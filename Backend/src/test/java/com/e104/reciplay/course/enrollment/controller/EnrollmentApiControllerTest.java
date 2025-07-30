package com.e104.reciplay.course.enrollment.controller;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(EnrollmentApiController.class)
@AutoConfigureMockMvc(addFilters = false)
class EnrollmentApiControllerTest {

    @Autowired
    private MockMvc mockMvc;

    private final String BASE_URL = "/api/v1/course/enrollent";

    @Test
    @WithMockUser
    @DisplayName("수강 신청 등록 API 테스트")
    void testCreateEnrollment() throws Exception {
        mockMvc.perform(post(BASE_URL)
                        .param("courseId", "1")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("수강 신청 등록에 성공하였습니다."))
                .andExpect(jsonPath("$.data").doesNotExist());
    }

    @Test
    @WithMockUser
    @DisplayName("수강 신청 삭제 API 테스트")
    void testDeleteEnrollment() throws Exception {
        mockMvc.perform(delete(BASE_URL)
                        .param("courseId", "1")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("수강 신청 삭제에 성공하였습니다."))
                .andExpect(jsonPath("$.data").doesNotExist());
    }
}
