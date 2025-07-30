package com.e104.reciplay.course.qna.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(QnaApiController.class)
@AutoConfigureMockMvc(addFilters = false)
class QnaApiControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @DisplayName("Q&A 요약 리스트 조회 테스트")
    void testGetQnaSummaries() throws Exception {
        mockMvc.perform(get("/api/v1/course/qna/summary")
                        .param("courseId", "1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Q&A 목록 조회에 성공하였습니다."));
    }

    @Test
    @DisplayName("Q&A 상세 조회 테스트")
    void testGetQnaDetail() throws Exception {
        mockMvc.perform(get("/api/v1/course/qna")
                        .param("qnaId", "1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Q&A 상세 정보 조회에 성공하였습니다."));
    }

    @Test
    @DisplayName("Q&A 질문 등록 테스트")
    void testInsertQuestion() throws Exception {
        mockMvc.perform(post("/api/v1/course/qna/question")
                        .param("qnaId", "1")
                        .param("title", "테스트 제목")
                        .param("content", "테스트 내용"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Q&A 질문 등록에 성공하였습니다."));
    }

    @Test
    @DisplayName("Q&A 질문 수정 테스트")
    void testUpdateQuestion() throws Exception {
        mockMvc.perform(put("/api/v1/course/qna/question")
                        .param("qnaId", "1")
                        .param("title", "수정된 제목")
                        .param("content", "수정된 내용"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Q&A 질문 수정에 성공하였습니다."));
    }

    @Test
    @DisplayName("Q&A 질문 삭제 테스트")
    void testDeleteQuestion() throws Exception {
        mockMvc.perform(delete("/api/v1/course/qna")
                        .param("qnaId", "1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Q&A 질문 삭제에 성공하였습니다."));
    }

    @Test
    @DisplayName("Q&A 답변 등록 테스트")
    void testInsertAnswer() throws Exception {
        mockMvc.perform(post("/api/v1/course/qna/answer")
                        .param("qnaId", "1")
                        .param("content", "답변 내용입니다"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Q&A 답변 등록에 성공하였습니다."));
    }

    @Test
    @DisplayName("Q&A 답변 수정 테스트")
    void testUpdateAnswer() throws Exception {
        mockMvc.perform(put("/api/v1/course/qna/answer")
                        .param("qnaId", "1")
                        .param("content", "수정된 답변"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Q&A 답변 수정에 성공하였습니다."));
    }
}
