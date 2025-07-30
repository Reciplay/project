package com.e104.reciplay.course.qna.controller;

import com.e104.reciplay.course.qna.dto.response.QnaDetail;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(QnaApiController.class)
@AutoConfigureMockMvc(addFilters = false)
class QnaApiControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @DisplayName("Q&A 요약 정보 리스트 조회")
    void getQnaSummaries() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.get("/api/v1/course/qna/summaries")
                        .param("courseId", "1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Q&A 목록 조회에 성공하였습니다."));
    }

    @Test
    @DisplayName("Q&A 상세 정보 조회")
    void getQnaDetail() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.get("/api/v1/course/qna")
                        .param("qnaId", "1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Q&A 상세 정보 조회에 성공하였습니다."));
    }

    @Test
    @DisplayName("Q&A 질문 수정")
    void updateQuestion() throws Exception {
        QnaDetail qnaDetail = new QnaDetail();
        mockMvc.perform(MockMvcRequestBuilders.put("/api/v1/course/qna/question")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(qnaDetail)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Q&A 질문 수정에 성공하였습니다."));
    }

    @Test
    @DisplayName("Q&A 질문 삭제")
    void deleteQuestion() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.delete("/api/v1/course/qna")
                        .param("qnaId", "1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Q&A 질문 삭제에 성공하였습니다."));
    }

    @Test
    @DisplayName("Q&A 질문 등록")
    void insertQuestion() throws Exception {
        QnaDetail qnaDetail = new QnaDetail();
        mockMvc.perform(MockMvcRequestBuilders.post("/api/v1/course/qna/question")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(qnaDetail)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Q&A 질문 등록에 성공하였습니다."));
    }

    @Test
    @DisplayName("Q&A 답변 수정")
    void updateAnswer() throws Exception {
        QnaDetail qnaDetail = new QnaDetail();
        mockMvc.perform(MockMvcRequestBuilders.put("/api/v1/course/qna/answer")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(qnaDetail)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Q&A 답변 수정에 성공하였습니다."));
    }

    @Test
    @DisplayName("Q&A 답변 등록")
    void insertAnswer() throws Exception {
        QnaDetail qnaDetail = new QnaDetail();
        mockMvc.perform(MockMvcRequestBuilders.post("/api/v1/course/qna/answer")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(qnaDetail)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Q&A 답변 등록에 성공하였습니다."));
    }
}
