package com.e104.reciplay.course.courses.controller;

import com.e104.reciplay.course.courses.dto.request.RequestCourseInfo;
import com.e104.reciplay.course.courses.dto.response.CourseDetail;
import com.e104.reciplay.course.courses.service.CourseCommandService;
import com.e104.reciplay.livekit.service.depends.CourseManagementService;
import com.e104.reciplay.livekit.service.depends.CourseQueryService;
import com.e104.reciplay.livekit.service.depends.InstructorQueryService;
import com.e104.reciplay.user.security.util.AuthenticationUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.MockedStatic;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.nio.charset.StandardCharsets;
import java.util.List;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
class CourseApiControllerTest {

    @Mock private CourseCommandService courseCommandService;
    @Mock private InstructorQueryService instructorQueryService;
    @Mock private CourseQueryService courseQueryService;
    @Mock private CourseManagementService courseManagementService;

    private MockMvc mockMvc;

    @BeforeEach
    void setup() {
        CourseApiController controller = new CourseApiController(
                courseCommandService,
                instructorQueryService,
                courseQueryService,
                courseManagementService
        );

        PageableHandlerMethodArgumentResolver pageableResolver =
                new PageableHandlerMethodArgumentResolver();

        mockMvc = MockMvcBuilders
                .standaloneSetup(controller)
                .setCustomArgumentResolvers(pageableResolver) // ★ 추가
                .build();
    }

    @Test
    @DisplayName("GET /cards - 페이지 카드 조회 성공")
    void getCourseCardsPage_ok() throws Exception {
        mockMvc.perform(
                        get("/api/v1/course/courses/cards")
                                .param("requestCategory", "special") // 필요 시 조건 파라미터
                                .param("page", "0")
                                .param("size", "10")
                )
                .andExpect(status().isOk());

        // 현재 컨트롤러는 내부에서 서비스 호출 없음 → 호출되지 않았음을 확인(안전망)
        verifyNoInteractions(courseCommandService, instructorQueryService, courseQueryService, courseManagementService);
    }

    @Test
    @DisplayName("GET /list - 강사의 강좌 상세 리스트 조회 성공")
    void getCourseCards_ok() throws Exception {
        String email = "test@example.com";
        Long instructorId = 77L;

        // static 메서드 mocking
        try (MockedStatic<AuthenticationUtil> mocked = mockStatic(AuthenticationUtil.class)) {
            mocked.when(AuthenticationUtil::getSessionUsername).thenReturn(email);
            when(instructorQueryService.queryInstructorIdByEmail(email)).thenReturn(instructorId);
            when(courseQueryService.queryCourseDetailsByInstructorId(instructorId))
                    .thenReturn(List.of(new CourseDetail()));

            mockMvc.perform(get("/api/v1/course/courses/list"))
                    .andExpect(status().isOk());

            verify(instructorQueryService).queryInstructorIdByEmail(email);
            verify(courseQueryService).queryCourseDetailsByInstructorId(instructorId);
            verifyNoMoreInteractions(instructorQueryService, courseQueryService);
        }
    }

    @Test
    @DisplayName("GET '' - 단건 상세 조회 (임시 구현) 200 반환")
    void getCourseDetail_ok() throws Exception {
        mockMvc.perform(get("/api/v1/course/courses")
                        .param("courseId", "123"))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("POST '' - 강좌 등록 multipart 요청 성공")
    void createCourse_ok() throws Exception {
        String email = "ins@example.com";
        Long instructorId = 9L;

        // JSON 파트 (RequestCourseInfo)
        String json = """
                {
                  "title":"테스트 강좌",
                  "enrollmentStartDate":"2025-08-01T10:00:00",
                  "enrollmentEndDate":"2025-08-31T18:00:00",
                  "categoryId": 10,
                  "summary":"요약",
                  "maxEnrollments":100,
                  "description":"설명",
                  "level":2,
                  "announcement":"공지",
                  "canLearns":["칼질","불조절"]
                }
                """;
        MockMultipartFile infoPart = new MockMultipartFile(
                "requestCourseInfo", "requestCourseInfo.json",
                MediaType.APPLICATION_JSON_VALUE, json.getBytes(StandardCharsets.UTF_8)
        );

        // 파일 파트
        MockMultipartFile cover = new MockMultipartFile(
                "courseCoverImage", "cover.png", "image/png", "cover".getBytes()
        );
        MockMultipartFile thumb1 = new MockMultipartFile(
                "thumbnailImages", "t1.png", "image/png", "t1".getBytes()
        );
        MockMultipartFile thumb2 = new MockMultipartFile(
                "thumbnailImages", "t2.png", "image/png", "t2".getBytes()
        );

        try (MockedStatic<AuthenticationUtil> mocked = mockStatic(AuthenticationUtil.class)) {
            mocked.when(AuthenticationUtil::getSessionUsername).thenReturn(email);
            when(instructorQueryService.queryInstructorIdByEmail(email)).thenReturn(instructorId);

            mockMvc.perform(
                            multipart("/api/v1/course/courses")
                                    .file(infoPart)
                                    .file(thumb1)
                                    .file(thumb2)
                                    .file(cover)
                                    .contentType(MediaType.MULTIPART_FORM_DATA)
                                    .characterEncoding("UTF-8")
                    )
                    .andExpect(status().isOk());

            // createCourseByInstructorId 호출 여부 및 파라미터 검증 (DTO는 캡처로 일부 필드 확인)
            ArgumentCaptor<RequestCourseInfo> infoCaptor = ArgumentCaptor.forClass(RequestCourseInfo.class);
            verify(courseManagementService).createCourseByInstructorId(eq(instructorId), infoCaptor.capture(), anyList(), any());
            RequestCourseInfo parsed = infoCaptor.getValue();
            // 최소한 필드 몇개 점검
            // (LocalDateTime 파싱은 스프링 컨버터가 하므로, 값이 들어왔는지만 확인)
            // 필요하면 assertEquals로 더 세밀하게 체크 가능
            org.junit.jupiter.api.Assertions.assertEquals("테스트 강좌", parsed.getTitle());
            org.junit.jupiter.api.Assertions.assertEquals(10L, parsed.getCategoryId());
            org.junit.jupiter.api.Assertions.assertEquals(2, parsed.getCanLearns().size());
        }
    }

    @Test
    @DisplayName("PUT '' - 강좌 수정 multipart 요청 성공")
    void updateCourse_ok() throws Exception {
        // JSON 파트 (RequestCourseInfo) — courseId 포함
        String json = """
                {
                  "courseId": 123,
                  "title":"수정 강좌",
                  "enrollmentStartDate":"2025-08-02T10:00:00",
                  "enrollmentEndDate":"2025-08-31T18:00:00",
                  "categoryId": 20,
                  "summary":"요약2",
                  "maxEnrollments":120,
                  "description":"설명2",
                  "level":3,
                  "announcement":"공지2",
                  "canLearns":["칼질","불조절","플레이팅"]
                }
                """;
        MockMultipartFile infoPart = new MockMultipartFile(
                "requestCourseInfo", "requestCourseInfo.json",
                MediaType.APPLICATION_JSON_VALUE, json.getBytes(StandardCharsets.UTF_8)
        );

        MockMultipartFile cover = new MockMultipartFile(
                "courseCoverImage", "cover2.png", "image/png", "cover2".getBytes()
        );
        MockMultipartFile thumb1 = new MockMultipartFile(
                "thumbnailImages", "t1.png", "image/png", "t1".getBytes()
        );

        // MockMvc의 multipart()는 기본 POST이므로 PUT으로 바꿔줘야 함
        MockHttpServletRequestBuilder putMultipart =
                multipart("/api/v1/course/courses")
                        .file(infoPart)
                        .file(thumb1)
                        .file(cover)
                        .contentType(MediaType.MULTIPART_FORM_DATA)
                        .characterEncoding("UTF-8")
                        .with(req -> { req.setMethod("PUT"); return req; });

        mockMvc.perform(putMultipart)
                .andExpect(status().isOk());

        ArgumentCaptor<RequestCourseInfo> infoCaptor = ArgumentCaptor.forClass(RequestCourseInfo.class);
        verify(courseManagementService).updateCourseByCourseId(infoCaptor.capture(), anyList(), any());
        RequestCourseInfo parsed = infoCaptor.getValue();
        org.junit.jupiter.api.Assertions.assertEquals(123L, parsed.getCourseId());
        org.junit.jupiter.api.Assertions.assertEquals("수정 강좌", parsed.getTitle());
        org.junit.jupiter.api.Assertions.assertEquals(3, parsed.getCanLearns().size());
    }
}



