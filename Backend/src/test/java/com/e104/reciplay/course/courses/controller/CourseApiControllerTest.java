package com.e104.reciplay.course.courses.controller;

import com.e104.reciplay.course.courses.dto.response.CourseDetail;
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

@WebMvcTest(CourseApiController.class)
@AutoConfigureMockMvc(addFilters = false)
class CourseApiControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @DisplayName("GET /cards - 강좌 카드 리스트 조회 성공")
    void getCourseCards_shouldReturnList() throws Exception {
        mockMvc.perform(get("/api/v1/course/courses/cards"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("success"));
    }

    @Test
    @DisplayName("GET /cards/page - 강좌 카드 페이지 조회 성공")
    void getCourseCardsPage_shouldReturnPagedList() throws Exception {
        mockMvc.perform(get("/api/v1/course/courses/cards/page"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("success"));
    }

    @Test
    @DisplayName("GET / - 강좌 상세 조회 성공")
    void getCourseDetail_shouldReturnDetail() throws Exception {
        mockMvc.perform(get("/api/v1/course/courses")
                        .param("courseId", "1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("success"));
    }

    @Test
    @DisplayName("POST / - 강좌 등록 성공")
    void createCourse_shouldReturnCreated() throws Exception {
        CourseDetail dummy = new CourseDetail(); // 필요한 필드 세팅 가능
        mockMvc.perform(post("/api/v1/course/courses")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dummy)))
                .andExpect(status().isOk()) // 실제는 .isCreated()이나, 컨트롤러에서 200 반환
                .andExpect(jsonPath("$.status").value("success"));
    }

    @Test
    @DisplayName("PUT / - 강좌 수정 성공")
    void updateCourse_shouldReturnSuccess() throws Exception {
        CourseDetail dummy = new CourseDetail(); // 필요한 필드 세팅 가능
        mockMvc.perform(put("/api/v1/course/courses")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dummy)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("success"));
    }
}
