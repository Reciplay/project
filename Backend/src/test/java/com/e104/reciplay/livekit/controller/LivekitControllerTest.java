package com.e104.reciplay.livekit.controller;

import com.e104.reciplay.common.handler.GlobalExceptionHandler;
import com.e104.reciplay.livekit.dto.response.LivekitTokenResponse;
import com.e104.reciplay.livekit.service.LivekitOpenService;
import com.e104.reciplay.user.security.domain.User;
import com.e104.reciplay.user.security.dto.CustomUserDetails;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import java.util.List;
import java.util.Map;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(LivekitController.class)
@Import(GlobalExceptionHandler.class)
@AutoConfigureMockMvc(addFilters = false)
class LivekitControllerTest {
    private final String LIVEKIT_URL = "/api/v1/livekit";
    private final Long MOCK_COURSE_ID = 1L;
    private final Long MOCK_LECTURE_ID = 1L;
    private final Long MOCK_USER_ID = 1L;
    private final String MOCK_USER_EMAIL = "test@e104.com";


    @Autowired
    private MockMvc mockMvc;
    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private LivekitOpenService livekitOpenService;
    @MockitoBean
    private SimpMessagingTemplate messagingTemplate;

    public void injectMockInstructor() {
        CustomUserDetails user = new CustomUserDetails(User.builder().id(MOCK_USER_ID).email(MOCK_USER_EMAIL).role("INSTRUCTOR").build());
        Authentication authentication = new UsernamePasswordAuthenticationToken(user, null, List.of(new SimpleGrantedAuthority("INSTRUCTOR")));
        SecurityContextHolder.getContext().setAuthentication(authentication);
    }

    public void injectMockStudent() {
        CustomUserDetails user = new CustomUserDetails(User.builder().id(MOCK_USER_ID).email(MOCK_USER_EMAIL).role("STUDENT").build());
        Authentication authentication = new UsernamePasswordAuthenticationToken(user, null, List.of(new SimpleGrantedAuthority("STUDENT")));
        SecurityContextHolder.getContext().setAuthentication(authentication);
    }

    @AfterEach
    public void cleanup() {
        SecurityContextHolder.clearContext();
    }

    @Test
    public void 강사_토큰_생성에_성공한다() throws Exception {
        injectMockInstructor();
        Map<String, String> request = Map.of("lectureId", MOCK_LECTURE_ID.toString(), "courseId", MOCK_COURSE_ID.toString());
        LivekitTokenResponse mockResponse = new LivekitTokenResponse("test_token", "test_roomID", "nickname", "email", 1L);
        Mockito.when(livekitOpenService.createInstructorToken(MOCK_LECTURE_ID, MOCK_COURSE_ID)).thenReturn(mockResponse);
        ResultActions resultActions = mockMvc.perform(MockMvcRequestBuilders.post(LIVEKIT_URL+"/instructor/token")
                .contentType(MediaType.APPLICATION_JSON).content(objectMapper.writeValueAsString(request)));


        resultActions.andExpect(status().isCreated());
        resultActions.andExpect(jsonPath("$.data.token").value("test_token"));
    }

    @Test
    public void 학생이_토큰_생성에_성공한다() throws Exception {
        injectMockStudent();
        Map<String, String> request = Map.of("lectureId", MOCK_LECTURE_ID.toString(), "courseId", MOCK_COURSE_ID.toString());
        LivekitTokenResponse mockResponse = new LivekitTokenResponse("test_token", "test_roomID", "nickname", "email", 1L);
        Mockito.when(livekitOpenService.createStudentToken(MOCK_LECTURE_ID, MOCK_COURSE_ID)).thenReturn(mockResponse);
        ResultActions resultActions = mockMvc.perform(MockMvcRequestBuilders.post(LIVEKIT_URL+"/student/token")
                .contentType(MediaType.APPLICATION_JSON).content(objectMapper.writeValueAsString(request)));


        resultActions.andExpect(status().isCreated());
        resultActions.andExpect(jsonPath("$.data.token").value("test_token"));
    }

//    @Test
//    public void 학생이_강사_토큰_생성에_실패한다() throws Exception {
//        injectMockStudent();
//        Map<String, String> request = Map.of("lectureId", MOCK_LECTURE_ID.toString(), "courseId", MOCK_COURSE_ID.toString());
//
//        ResultActions resultActions = mockMvc.perform(MockMvcRequestBuilders.post(LIVEKIT_URL+"/instructor/token")
//                .contentType(MediaType.APPLICATION_JSON).content(objectMapper.writeValueAsString(request)));
//
//
//        resultActions.andExpect(status().isForbidden());
//    }
}