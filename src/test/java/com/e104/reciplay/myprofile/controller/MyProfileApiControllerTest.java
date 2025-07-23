package com.e104.reciplay.myprofile.controller;

import com.e104.reciplay.myprofile.dto.ProfileInfoRequest;
import com.e104.reciplay.myprofile.service.MyProfileManagementService;
import com.e104.reciplay.security.exception.EmailNotFoundException;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Profile;
import org.springframework.http.MediaType;
import org.springframework.security.core.parameters.P;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.*;

@WebMvcTest(controllers = {MyProfileApiController.class})
@AutoConfigureMockMvc(addFilters = false)
@WithMockUser(username = "wonjun@mail.com", password = "123", roles = {"USER"})
class MyProfileApiControllerTest {
    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private MockMvc mockMvc;
    @MockitoBean
    private MyProfileManagementService myProfileManagementService;

    @Test
    public void 프로필_정보_입력에_성공한다() throws Exception {
        // given
        ProfileInfoRequest request = new ProfileInfoRequest("원준", "백엔드개발자", LocalDate.of(2000, 2, 6), 1);

        // when
        ResultActions resultActions = mockMvc.perform(MockMvcRequestBuilders.post("/api/v1/my-profile/info")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)));

        resultActions.andExpect(MockMvcResultMatchers.status().isOk());
        Mockito.verify(myProfileManagementService, Mockito.times(1)).setupMyProfile("wonjun@mail.com", request);
    }

    @Test
    public void 이메일이_존재하지_않으면_프로필_정보_입력에_실패한다() throws Exception{
        ProfileInfoRequest request = new ProfileInfoRequest("원준", "백엔드개발자", LocalDate.of(2000, 2, 6), 1);
        Mockito.doThrow(new EmailNotFoundException("존재하지 않는 이메일")).when(myProfileManagementService).setupMyProfile("wonjun@mail.com", request);

        ResultActions resultActions = mockMvc.perform(MockMvcRequestBuilders
                .post("/api/v1/my-profile/info")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)));

        resultActions.andExpect(MockMvcResultMatchers.status().isBadRequest());
    }
}