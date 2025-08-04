package com.e104.reciplay.course.courses.controller;

import com.e104.reciplay.course.courses.dto.request.CourseRegisterInfo;
import com.e104.reciplay.common.dto.FileCondition;
import com.e104.reciplay.s3.enums.FileCategory;
import com.e104.reciplay.s3.enums.RelatedType;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.List;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc(addFilters = false)
class CourseApiControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @DisplayName("강좌 등록 API - JSON 기반 요청 성공")
    void testCreateCourse() throws Exception {
        CourseRegisterInfo courseDto = CourseRegisterInfo.builder()
                .title("강좌 제목 예시")
                .category("요리")
                .summary("한식을 배워요")
                .description("기초부터 배우는 요리 수업")
                .level(1)
                .maxEnrollments(100)
                .announcement("칼과 재료를 준비해주세요.")
                .canLearns(List.of("재료 손질", "불 조절"))
                .enrollmentStartDate(LocalDateTime.now())
                .enrollmentEndDate(LocalDateTime.now().plusDays(7))
                .coverimageCondition(FileCondition.builder()
                        .fileCategory(FileCategory.IMAGES)
                        .relatedType(RelatedType.USER_PROFILE)
                        .relatedId(1L)
                        .sequuence(0)
                        .file(null)  // MultipartFile은 JSON 직렬화 시 제외됨
                        .build())
                .thumbnailConditions(List.of()) // 테스트용 비워둠
                .chapters(List.of())
                .build();

        mockMvc.perform(post("/api/v1/course/courses")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(courseDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("강좌 등록에 성공하였습니다."));
    }

    @Test
    @DisplayName("강좌 상세 조회 API 테스트")
    void testGetCourseDetail() throws Exception {
        mockMvc.perform(get("/api/v1/course/courses")
                        .param("courseId", "1")) // 존재하는 ID로 테스트
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("강좌 상세 정보 조회에 성공하였습니다."));
    }

    @Test
    @DisplayName("강좌 카드 리스트 조회 API 테스트")
    void testGetCourseCardPage() throws Exception {
        mockMvc.perform(get("/api/v1/course/courses/cards")
                        .param("requestCategory", "ALL")
                        .param("page", "0")
                        .param("size", "5"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("강좌 카드 정보 리스트 조회에 성공하였습니다."));
    }

    @Test
    @DisplayName("강사의 강좌 목록 조회 API 테스트")
    void testGetCourseListByInstructor() throws Exception {
        mockMvc.perform(get("/api/v1/course/courses/list"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("강좌 상세 정보 리스트 조회에 성공하였습니다."));
    }
}
