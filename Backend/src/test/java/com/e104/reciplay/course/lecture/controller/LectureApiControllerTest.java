package com.e104.reciplay.course.lecture.controller;

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

@WebMvcTest(LectureApiController.class)
@AutoConfigureMockMvc(addFilters = false)
class LectureApiControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @DisplayName("강의 요약 리스트 조회 API 테스트")
    void testGetLectureSummaries() throws Exception {
        mockMvc.perform(get("/api/v1/course/lecture/summary"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("강의 요약 리스트 조회에 성공하였습니다."));
    }

    @Test
    @DisplayName("강의 상세 정보 조회 API 테스트")
    void testGetLectureDetail() throws Exception {
        mockMvc.perform(get("/api/v1/course/lecture")
                        .param("lectureId", "1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("강의 상세 정보 조회에 성공하였습니다."));
    }

    @Test
    @DisplayName("강의 상세 정보 리스트 조회 API 테스트")
    void testGetLectureDetails() throws Exception {
        mockMvc.perform(get("/api/v1/course/lecture/"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("강의 요약 리스트 조회에 성공하였습니다."));
    }

    @Test
    @DisplayName("강의 휴강 상태 변경 API 테스트")
    void testUpdateSkipStatus() throws Exception {
        mockMvc.perform(patch("/api/v1/course/lecture/skip")
                        .param("lectureId", "1")
                        .param("isSkpied", "1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("강의 휴강 상태 변경에 성공하였습니다."));
    }

    @Test
    @DisplayName("강의 정보 수정 API 테스트")
    void testUpdateLecture() throws Exception {
        String requestBody = objectMapper.writeValueAsString(new LectureUpdateInfo());
        mockMvc.perform(put("/api/v1/course/lecture")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("강의 정보 수정에 성공하였습니다."));
    }


}
