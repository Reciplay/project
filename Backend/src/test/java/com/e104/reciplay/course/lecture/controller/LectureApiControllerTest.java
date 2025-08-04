
package com.e104.reciplay.course.lecture.controller;

import com.e104.reciplay.course.lecture.dto.response.LectureDetail;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(LectureApiController.class)
@AutoConfigureMockMvc(addFilters = false)
class LectureApiControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @DisplayName("강의 요약 리스트 조회 성공")
    void getLectureSummaries() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.get("/api/v1/course/lecture/summaries")
                        .param("courseId", "1"))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("강의 상세 조회 성공")
    void getLectureDetail() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.get("/api/v1/course/lecture")
                        .param("lectureId", "1"))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("강의 상세 리스트 조회 성공")
    void getLectureDetails() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.get("/api/v1/course/lecture/list")
                        .param("courseId", "1"))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("강의 휴강 상태 변경 성공")
    void updateSkipStatus() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.patch("/api/v1/course/lecture/skip")
                        .param("lectureId", "1")
                        .param("isSkipped", "true"))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("강의 정보 수정 성공")
    void updateLecture() throws Exception {
        LectureDetail lectureDetail = new LectureDetail(); // 필드 필요 시 설정
        mockMvc.perform(MockMvcRequestBuilders.put("/api/v1/course/lecture")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(lectureDetail)))
                .andExpect(status().isOk());
    }
}
