package com.e104.reciplay.myprofile.controller;

import com.e104.reciplay.user.profile.controller.ProfileApiController;
import com.e104.reciplay.user.profile.dto.ProfileInfoRequest;
import com.e104.reciplay.user.profile.dto.ProfileInformation;
import com.e104.reciplay.user.profile.service.MyProfileManagementService;
import com.e104.reciplay.user.profile.service.MyProfileQueryService;
import com.e104.reciplay.user.security.exception.EmailNotFoundException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import java.time.LocalDate;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = {ProfileApiController.class})
@AutoConfigureMockMvc(addFilters = false)
@WithMockUser(username = "wonjun@mail.com", password = "123", roles = {"USER"})
class MyProfileApiControllerTest {
    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private MockMvc mockMvc;
    @MockitoBean
    private MyProfileManagementService myProfileManagementService;

    @MockitoBean
    private MyProfileQueryService myProfileQueryService;

    private static final String PROFILE_DOMAIN_URI = "/api/v1/user/profile";

    @Test
    public void 프로필_정보_입력에_성공한다() throws Exception {
        // given
        ProfileInfoRequest request = new ProfileInfoRequest("원준", "백엔드개발자", LocalDate.of(2000, 2, 6), 1);

        // when
        ResultActions resultActions = mockMvc.perform(MockMvcRequestBuilders.post(PROFILE_DOMAIN_URI)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)));

        resultActions.andExpect(status().isOk());
        Mockito.verify(myProfileManagementService, Mockito.times(1)).setupMyProfile("wonjun@mail.com", request);
    }

    @Test
    public void 이메일이_존재하지_않으면_프로필_정보_입력에_실패한다() throws Exception{
        ProfileInfoRequest request = new ProfileInfoRequest("원준", "백엔드개발자", LocalDate.of(2000, 2, 6), 1);
        Mockito.doThrow(new EmailNotFoundException("존재하지 않는 이메일")).when(myProfileManagementService).setupMyProfile("wonjun@mail.com", request);

        ResultActions resultActions = mockMvc.perform(MockMvcRequestBuilders
                .post(PROFILE_DOMAIN_URI)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)));

        resultActions.andExpect(status().isBadRequest());
    }

    @Test
    public void 회원정보_조회에_성공한다() throws Exception{
        Mockito.when(myProfileQueryService.queryProfileInformation()).thenReturn(ProfileInformation.builder()
                .job("개발자").email("wonjun@mail.com").name("이원준").activated(true).gender(1).build());

        ResultActions resultActions = mockMvc.perform(MockMvcRequestBuilders.get(PROFILE_DOMAIN_URI));

        resultActions.andExpect(status().isOk());
        resultActions.andExpect(jsonPath("$.data.email").value("wonjun@mail.com"));
    }
}