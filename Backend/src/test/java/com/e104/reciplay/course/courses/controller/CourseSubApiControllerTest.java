package com.e104.reciplay.course.courses.controller;

import com.e104.reciplay.common.types.TodoType;
import com.e104.reciplay.course.lecture.dto.request.item.LectureRegisterRequest;
import com.e104.reciplay.course.courses.dto.request.item.ChapterItem;
import com.e104.reciplay.course.lecture.controller.LectureApiController;
import com.e104.reciplay.course.lecture.dto.TodoInfo;
import com.e104.reciplay.course.lecture.service.LectureManagementService;
import com.e104.reciplay.course.lecture.service.LectureQueryService;
import com.e104.reciplay.livekit.service.depends.CourseManagementService;
import com.e104.reciplay.user.security.domain.User;
import com.e104.reciplay.user.security.dto.CustomUserDetails;
import com.e104.reciplay.user.security.repository.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;

import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(LectureApiController.class)
@AutoConfigureMockMvc(addFilters = false)
class CourseSubApiControllerTest {
    @MockitoBean
    private LectureManagementService lectureManagementService;

    @MockitoBean
    private LectureQueryService lectureQueryService;

    @MockitoBean
    private CourseManagementService courseManagementService;

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    private User user;

    @BeforeEach
    public void setup() {
        user = new User(null, "test@mail.com", "123", "nn", "lwj", LocalDate.now(), 1, "개발자", null, true, "USER_INSTRUCTOR");
        Authentication auth = new UsernamePasswordAuthenticationToken(new CustomUserDetails(user), null, List.of(new SimpleGrantedAuthority(user.getRole())));
        SecurityContextHolder.getContext().setAuthentication(auth);
    }

    @Test
    public void 강의_정보_업로드_API_호출에_성공한다() throws Exception {
        // given
        String url = "/api/v1/course/lecture";
        MockMultipartFile file1 = new MockMultipartFile("material/0", "강의1번자료.pdf", "application/pdf", "test".getBytes());
        MockMultipartFile file2 = new MockMultipartFile("material/1", "강의2번자료.pdf", "application/pdf", "test".getBytes());


        List<TodoInfo> todoList = new ArrayList<>();
        todoList.add(new TodoInfo(null, 0, "양파 썰기", TodoType.NORMAL, 0));
        todoList.add(new TodoInfo(null, 1, "물 끓이기", TodoType.TIMER, 300));

        List<ChapterItem> chapterList = new ArrayList<>();
        chapterList.add(new ChapterItem(null, 0, "재료 준비", todoList));
        chapterList.add(new ChapterItem(null, 1, "조리 시작", new ArrayList<>()));


        LectureRegisterRequest lectureRegisterRequest = LectureRegisterRequest.builder()
                .title("맛있는 요리 만들기")
                .summary("초보자를 위한 요리 강의")
                .sequence(0)
                .materials("양파, 냄비, 물")
                .startedAt(LocalDateTime.of(2024, 8, 8, 10, 0, 0))
                .endedAt(LocalDateTime.of(2024, 8, 8, 11, 0, 0))
                .chapterList(chapterList)
                .build();

        List<LectureRegisterRequest> lectureRegisterRequests = List.of(lectureRegisterRequest);

        MockMultipartFile lecturePart = new MockMultipartFile("lecture", "", "application/json",
                objectMapper.writeValueAsString(lectureRegisterRequests).getBytes(StandardCharsets.UTF_8));

        // when
        ResultActions resultActions = mockMvc.perform(multipart(url)
                .file(file1)
                .file(file2)
                .file(lecturePart)
                .param("courseId", "1")
                .contentType(MediaType.MULTIPART_FORM_DATA)
                .accept(MediaType.APPLICATION_JSON));

        // then
        resultActions.andExpect(status().isCreated());
    }

//    @Test
//    public void 강의_정보_수정_API_호출에_성공한다() throws Exception {
//        // given
//        String url = "/api/v1/course/lecture/update";
//        MockMultipartFile file1 = new MockMultipartFile("material/0", "강의1번자료.pdf", "application/pdf", "test".getBytes());
//        MockMultipartFile file2 = new MockMultipartFile("material/1", "강의2번자료.pdf", "application/pdf", "test".getBytes());
//
//
//        List<TodoInfo> todoList = new ArrayList<>();
//        todoList.add(new TodoInfo(null, 0, "양파 썰기", TodoType.NORMAL, 0));
//        todoList.add(new TodoInfo(null, 1, "물 끓이기", TodoType.TIMER, 300));
//
//        List<ChapterItem> chapterList = new ArrayList<>();
//        chapterList.add(new ChapterItem(null, 0, "재료 준비", todoList));
//        chapterList.add(new ChapterItem(null, 1, "조리 시작", new ArrayList<>()));
//
//
//        LectureRegisterRequest lectureRegisterRequest = LectureRegisterRequest.builder()
//                .title("맛있는 요리 만들기")
//                .summary("초보자를 위한 요리 강의")
//                .sequence(0)
//                .materials("양파, 냄비, 물")
//                .startedAt(LocalDateTime.of(2024, 8, 8, 10, 0, 0))
//                .endedAt(LocalDateTime.of(2024, 8, 8, 11, 0, 0))
//                .chapterList(chapterList)
//                .build();
//
//        List<LectureRegisterRequest> lectureRegisterRequests = List.of(lectureRegisterRequest);
//
//        MockMultipartFile lecturePart = new MockMultipartFile("lecture", "", "application/json",
//                objectMapper.writeValueAsString(lectureRegisterRequests).getBytes(StandardCharsets.UTF_8));
//
//        // when
//        ResultActions resultActions = mockMvc.perform(multipart(url)
//                .file(file1)
//                .file(file2)
//                .file(lecturePart)
//                .param("courseId", "1")
//                .contentType(MediaType.MULTIPART_FORM_DATA)
//                .accept(MediaType.APPLICATION_JSON));
//
//        // then
//        resultActions.andExpect(status().isOk());
//    }

    @AfterEach
    public void cleanup() {
        SecurityContextHolder.clearContext();
    }
}
