package com.e104.reciplay.course.courses.controller;

import com.e104.reciplay.common.types.TodoType;
import com.e104.reciplay.course.courses.dto.request.LectureRequest;
import com.e104.reciplay.course.courses.dto.request.item.ChapterItem;
import com.e104.reciplay.course.lecture.dto.response.TodoInfo;
import com.e104.reciplay.course.lecture.service.LectureManagementService;
import com.e104.reciplay.livekit.service.depends.CourseManagementService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;

import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(CourseSubApiController.class)
@AutoConfigureMockMvc(addFilters = false)
class CourseSubApiControllerTest {
    @MockitoBean
    private LectureManagementService lectureManagementService;

    @MockitoBean
    private CourseManagementService courseManagementService;

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    public void 강의_정보_업로드_API_호출에_성공한다() throws Exception {
        // given
        String url = "/api/v1/course/courses/lectures";
        MockMultipartFile file1 = new MockMultipartFile("material/0", "강의1번자료.pdf", "application/pdf", "test".getBytes());
        MockMultipartFile file2 = new MockMultipartFile("material/1", "강의2번자료.pdf", "application/pdf", "test".getBytes());


        List<TodoInfo> todoList = new ArrayList<>();
        todoList.add(new TodoInfo(0, "양파 썰기", TodoType.NORMAL, 0));
        todoList.add(new TodoInfo(1, "물 끓이기", TodoType.TIMER, 300));

        List<ChapterItem> chapterList = new ArrayList<>();
        chapterList.add(new ChapterItem(0, "재료 준비", todoList));
        chapterList.add(new ChapterItem(1, "조리 시작", new ArrayList<>()));


        LectureRequest lectureRequest = LectureRequest.builder()
                .title("맛있는 요리 만들기")
                .summary("초보자를 위한 요리 강의")
                .sequence(0)
                .materials("양파, 냄비, 물")
                .startedAt(LocalDateTime.of(2024, 8, 8, 10, 0, 0))
                .endedAt(LocalDateTime.of(2024, 8, 8, 11, 0, 0))
                .chapterList(chapterList)
                .build();

        List<LectureRequest> lectureRequests = List.of(lectureRequest);

        MockMultipartFile lecturePart = new MockMultipartFile("lecture", "", "application/json",
                objectMapper.writeValueAsString(lectureRequests).getBytes(StandardCharsets.UTF_8));

        // when
        ResultActions resultActions = mockMvc.perform(multipart(url)
                .file(file1)
                .file(file2)
                .file(lecturePart)
                .param("courseId", "1")
                .contentType(MediaType.MULTIPART_FORM_DATA)
                .accept(MediaType.APPLICATION_JSON));

        // then
        resultActions.andExpect(status().isOk());
    }
}
