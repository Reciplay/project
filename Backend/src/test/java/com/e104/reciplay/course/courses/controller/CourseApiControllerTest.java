package com.e104.reciplay.course.courses.controller;

import com.e104.reciplay.course.courses.dto.request.CourseCardCondition;
import com.e104.reciplay.course.courses.dto.request.RequestCourseInfo;
import com.e104.reciplay.course.courses.dto.response.CourseCard;
import com.e104.reciplay.course.courses.dto.response.CourseDetail;
import com.e104.reciplay.course.courses.dto.response.PagedResponse;
import com.e104.reciplay.course.courses.service.CourseCardQueryService;
import com.e104.reciplay.livekit.service.depends.CourseManagementService;
import com.e104.reciplay.livekit.service.depends.CourseQueryService;
import com.e104.reciplay.livekit.service.depends.InstructorQueryService;
import com.e104.reciplay.user.security.domain.User;
import com.e104.reciplay.user.security.service.UserQueryService;
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

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
class CourseApiControllerTest {

    @Mock private InstructorQueryService instructorQueryService;
    @Mock private CourseQueryService courseQueryService;
    @Mock private CourseManagementService courseManagementService;
    @Mock private UserQueryService userQueryService;
    // ✅ 추가: /cards에서 사용할 서비스
    @Mock private CourseCardQueryService courseCardQueryService;

    private MockMvc mockMvc;

    @BeforeEach
    void setup() {
        // ✅ 생성자 인자에 courseCardQueryService 추가
        CourseApiController controller = new CourseApiController(
                instructorQueryService,
                courseQueryService,
                courseManagementService,
                userQueryService,
                courseCardQueryService
        );

        PageableHandlerMethodArgumentResolver pageableResolver =
                new PageableHandlerMethodArgumentResolver();

        mockMvc = MockMvcBuilders
                .standaloneSetup(controller)
                .setCustomArgumentResolvers(pageableResolver) // Pageable 처리
                .build();
    }

    @Test
    @DisplayName("GET /cards - 페이지 카드 조회 성공 (userId 반영, 서비스 호출 검증)")
    void getCourseCardsPage_ok() throws Exception {
        String email = "user@example.com";
        Long userId = 100L;

        User mockUser = mock(User.class);
        when(mockUser.getId()).thenReturn(userId);

        PagedResponse<CourseCard> fakePage = PagedResponse.<CourseCard>builder()
                .content(List.of())
                .page(0)
                .size(10)
                .totalPages(0)
                .totalElements(0L)
                .hasNext(false)
                .hasPrevious(false)
                .build();

        try (MockedStatic<AuthenticationUtil> mocked = mockStatic(AuthenticationUtil.class)) {
            mocked.when(AuthenticationUtil::getSessionUsername).thenReturn(email);
            when(userQueryService.queryUserByEmail(email)).thenReturn(mockUser);

            // ✅ 기존 courseQueryService가 아니라 courseCardQueryService로 스텁/검증
            when(courseCardQueryService.queryCardsByCardCondtion(any(CourseCardCondition.class), any(), eq(userId)))
                    .thenReturn(fakePage);

            mockMvc.perform(
                            get("/api/v1/course/courses/cards")
                                    .param("requestCategory", "special")
                                    .param("page", "0")
                                    .param("size", "10")
                                    .param("sort", "courseStartDate,desc")
                    )
                    .andExpect(status().isOk());

            ArgumentCaptor<CourseCardCondition> condCap = ArgumentCaptor.forClass(CourseCardCondition.class);
            verify(courseCardQueryService).queryCardsByCardCondtion(condCap.capture(), any(), eq(userId));
            assertEquals("special", condCap.getValue().getRequestCategory());

            verify(userQueryService).queryUserByEmail(email);
            verifyNoMoreInteractions(userQueryService, courseCardQueryService);
            verifyNoInteractions(instructorQueryService, courseManagementService, courseQueryService);
        }
    }

    @Test
    @DisplayName("GET /list - 강사의 강좌 상세 리스트 조회 성공 (courseStatus 파라미터 포함)")
    void getCourseCards_ok() throws Exception {
        String email = "test@example.com";
        Long instructorId = 77L;
        String courseStatus = "soon";

        try (MockedStatic<AuthenticationUtil> mocked = mockStatic(AuthenticationUtil.class)) {
            mocked.when(AuthenticationUtil::getSessionUsername).thenReturn(email);
            when(instructorQueryService.queryInstructorIdByEmail(email)).thenReturn(instructorId);
            when(courseQueryService.queryCourseDetailsByInstructorId(instructorId, courseStatus))
                    .thenReturn(List.of(new CourseDetail()));

            mockMvc.perform(get("/api/v1/course/courses/list")
                            .param("courseStatus", courseStatus))
                    .andExpect(status().isOk());

            verify(instructorQueryService).queryInstructorIdByEmail(email);
            verify(courseQueryService).queryCourseDetailsByInstructorId(instructorId, courseStatus);
            verifyNoMoreInteractions(instructorQueryService, courseQueryService);
            verifyNoInteractions(courseManagementService, userQueryService, courseCardQueryService);
        }
    }

    @Test
    @DisplayName("GET '' - 단건 상세 조회 200 반환 (userId 포함 로직 반영)")
    void getCourseDetail_ok() throws Exception {
        String email = "user@example.com";
        Long userId = 999L;
        Long courseId = 123L;

        try (MockedStatic<AuthenticationUtil> mocked = mockStatic(AuthenticationUtil.class)) {
            mocked.when(AuthenticationUtil::getSessionUsername).thenReturn(email);

            User mockUser = mock(User.class);
            when(mockUser.getId()).thenReturn(userId);
            when(userQueryService.queryUserByEmail(email)).thenReturn(mockUser);

            when(courseQueryService.queryCourseDetailByCourseId(courseId, userId))
                    .thenReturn(new CourseDetail());

            mockMvc.perform(get("/api/v1/course/courses")
                            .param("courseId", String.valueOf(courseId)))
                    .andExpect(status().isOk());

            verify(userQueryService).queryUserByEmail(email);
            verify(courseQueryService).queryCourseDetailByCourseId(courseId, userId);
            verifyNoMoreInteractions(userQueryService, courseQueryService);
            verifyNoInteractions(instructorQueryService, courseManagementService, courseCardQueryService);
        }
    }

    @Test
    @DisplayName("POST '' - 강좌 등록 multipart 요청 성공 (CourseIdResponse 반환)")
    void createCourse_ok() throws Exception {
        String email = "ins@example.com";
        Long instructorId = 9L;

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
            when(courseManagementService.createCourseByInstructorId(anyLong(), any(RequestCourseInfo.class), anyList(), any()))
                    .thenReturn(100L);

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

            ArgumentCaptor<RequestCourseInfo> infoCaptor = ArgumentCaptor.forClass(RequestCourseInfo.class);
            verify(courseManagementService).createCourseByInstructorId(eq(instructorId), infoCaptor.capture(), anyList(), any());
            RequestCourseInfo parsed = infoCaptor.getValue();
            assertEquals("테스트 강좌", parsed.getTitle());
            assertEquals(10L, parsed.getCategoryId());
            assertEquals(2, parsed.getCanLearns().size());

            verifyNoInteractions(courseCardQueryService);
        }
    }

    @Test
    @DisplayName("PUT '' - 강좌 수정 multipart 요청 성공 (CourseIdResponse 반환)")
    void updateCourse_ok() throws Exception {
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

        MockHttpServletRequestBuilder putMultipart =
                multipart("/api/v1/course/courses")
                        .file(infoPart)
                        .file(thumb1)
                        .file(cover)
                        .contentType(MediaType.MULTIPART_FORM_DATA)
                        .characterEncoding("UTF-8")
                        .with(req -> { req.setMethod("PUT"); return req; });

        when(courseManagementService.updateCourseByCourseId(any(RequestCourseInfo.class), anyList(), any()))
                .thenReturn(123L);

        mockMvc.perform(putMultipart)
                .andExpect(status().isOk());

        ArgumentCaptor<RequestCourseInfo> infoCaptor = ArgumentCaptor.forClass(RequestCourseInfo.class);
        verify(courseManagementService).updateCourseByCourseId(infoCaptor.capture(), anyList(), any());
        RequestCourseInfo parsed = infoCaptor.getValue();
        assertEquals(123L, parsed.getCourseId());
        assertEquals("수정 강좌", parsed.getTitle());
        assertEquals(3, parsed.getCanLearns().size());

        verifyNoInteractions(courseCardQueryService);
    }
}
