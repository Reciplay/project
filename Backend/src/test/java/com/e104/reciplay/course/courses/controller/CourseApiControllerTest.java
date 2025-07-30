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
    @DisplayName("강좌 카드 정보 리스트 조회 API 테스트")
    void testGetCourseCards() throws Exception {
        mockMvc.perform(get("/api/v1/course/courses/Card")
                        .param("categoryId", "1")
                        .param("page", "0")
                        .param("size", "5")
                        .param("sort", "courseStartDate,DESC"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("강좌 카드 정보 리스트 조회에 성공하였습니다."));
    }

    @Test
    @DisplayName("강좌 상세 정보 조회 API 테스트")
    void testGetCourseDetail() throws Exception {
        mockMvc.perform(get("/api/v1/course/courses")
                        .param("courseId", "123"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("강좌 상세 정보 조회에 성공하였습니다."));
    }

    @Test
    @DisplayName("강좌 등록 API 테스트")
    void testCreateCourse() throws Exception {
        CourseDetail courseDetail = new CourseDetail();
        String content = objectMapper.writeValueAsString(courseDetail);

        mockMvc.perform(post("/api/v1/course/courses")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(content))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("강좌 등록에 성공하였습니다."));
    }

    @Test
    @DisplayName("강좌 수정 API 테스트")
    void testUpdateCourse() throws Exception {
        CourseDetail courseDetail = new CourseDetail();
        String content = objectMapper.writeValueAsString(courseDetail);

        mockMvc.perform(put("/api/v1/course/courses")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(content))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("강좌 정보 수정에 성공하였습니다."));
    }
}
