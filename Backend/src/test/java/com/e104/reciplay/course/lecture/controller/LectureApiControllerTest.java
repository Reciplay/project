
package com.e104.reciplay.course.lecture.controller;


import com.e104.reciplay.course.lecture.repository.CustomChapterRepository;
import com.e104.reciplay.course.lecture.repository.CustomLectureRepository;
import com.e104.reciplay.course.lecture.service.LectureManagementService;
import com.e104.reciplay.course.lecture.service.LectureQueryService;
import com.e104.reciplay.livekit.service.depends.CourseHistoryQueryService;
import com.e104.reciplay.livekit.service.depends.CourseManagementService;
import com.e104.reciplay.repository.CourseRepository;
import com.e104.reciplay.course.lecture.dto.LectureDetail;
import com.e104.reciplay.repository.LectureRepository;
import com.e104.reciplay.s3.service.FileMetadataQueryService;
import com.e104.reciplay.s3.service.S3Service;
import com.e104.reciplay.user.security.domain.User;
import com.e104.reciplay.user.security.dto.CustomUserDetails;
import com.e104.reciplay.user.security.service.UserQueryService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import java.time.LocalDate;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(LectureApiController.class)
@AutoConfigureMockMvc(addFilters = false)
@ActiveProfiles("test")
class LectureApiControllerTest {

    @MockitoBean
    private CourseManagementService courseManagementService;

    @Autowired
    private MockMvc mockMvc;
    @Autowired
    private ObjectMapper objectMapper;
    @MockitoBean
    private LectureQueryService lectureQueryService;
    @MockitoBean
    private LectureManagementService lectureManagementService;
    @MockitoBean
    private LectureRepository lectureRepository;
    @MockitoBean
    private CustomLectureRepository lectureQueryRepository;
    @MockitoBean
    private CourseRepository courseRepository;
    @MockitoBean
    private CustomChapterRepository chapterQueryRepository;

    @MockitoBean
    private FileMetadataQueryService fileMetadataQueryService;

    @MockitoBean
    private S3Service s3Service;
    @MockitoBean
    private CourseHistoryQueryService courseHistoryQueryService;
    @MockitoBean
    private UserQueryService userQueryService;

    User user;

    @BeforeEach
    public void setup() {
        user = new User(1L, "test@mail.com", "123", "nn", "lwj", LocalDate.now(), 1, "개발자", null, true, "USER_INSTRUCTOR");
        Authentication auth = new UsernamePasswordAuthenticationToken(new CustomUserDetails(user), null, List.of(new SimpleGrantedAuthority(user.getRole())));
        SecurityContextHolder.getContext().setAuthentication(auth);
    }

    @Test
    @DisplayName("강의 요약 리스트 조회 성공")
    void getLectureSummaries() throws Exception {
        Mockito.when(lectureQueryService.queryLectureSummaries(any())).thenReturn(List.of());
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
        mockMvc.perform(MockMvcRequestBuilders.put("/api/v1/course/lecture/skip")
                        .param("lectureId", "1")
                        .param("isSkipped", "true"))
                .andExpect(status().isOk());
    }

    @AfterEach
    public void cleanup() {
        SecurityContextHolder.clearContext();
    }
}
