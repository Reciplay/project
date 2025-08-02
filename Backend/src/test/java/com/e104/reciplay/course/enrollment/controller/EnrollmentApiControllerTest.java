
package com.e104.reciplay.course.enrollment.controller;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
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

    @Test
    @DisplayName("수강 신청 등록 - 성공")
    void createEnrollment_success() throws Exception {
        mockMvc.perform(post("/api/v1/course/enrollment")
                        .param("courseId", "1")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("수강 신청 등록에 성공하였습니다."));
    }

    @Test
    @DisplayName("수강 신청 삭제 - 성공")
    void deleteEnrollment_success() throws Exception {
        mockMvc.perform(delete("/api/v1/course/enrollment")
                        .param("courseId", "1")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("수강 신청 삭제에 성공하였습니다."));
    }
}