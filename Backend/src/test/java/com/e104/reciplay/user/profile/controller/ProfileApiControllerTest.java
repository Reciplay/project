package com.e104.reciplay.user.profile.controller;

import com.e104.reciplay.user.profile.dto.request.ProfileInfoRequest;
import com.e104.reciplay.user.profile.service.MyProfileManagementService;
import com.e104.reciplay.user.profile.service.MyProfileQueryService;
import com.e104.reciplay.user.security.domain.User;
import com.e104.reciplay.user.security.dto.CustomUserDetails;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import org.junit.jupiter.api.Disabled;
import org.springframework.web.multipart.MultipartFile;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.mock;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(ProfileApiController.class)
@AutoConfigureMockMvc(addFilters = false)
@ActiveProfiles("test")
class ProfileApiControllerTest {
    @MockitoBean
    private MyProfileManagementService myProfileManagementService;

    @MockitoBean
    private MyProfileQueryService myProfileQueryService;

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @BeforeEach
    public void setup() {
        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken(
                        new CustomUserDetails(User.builder().email("test@mail.com").build())
                        , null
                        , null
                )
        );
    }

    @Test
    public void 회원정보_기입_요청에_성공한다() throws Exception {
        doNothing().when(myProfileManagementService).setupMyProfile(Mockito.anyString(), Mockito.any(ProfileInfoRequest.class));
        ProfileInfoRequest request = new ProfileInfoRequest();

        String url = "/api/v1/user/profile";
        ResultActions resultActions = mockMvc.perform(post(url)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)));
        resultActions.andExpect(status().isOk());
    }


    @Test
    public void 프로필사진_업로드에_성공한다() throws Exception {
        doNothing().when(myProfileManagementService).updateProfileImage(any(MultipartFile.class), anyString());

        MockMultipartFile mockMultipartFile = new MockMultipartFile("profileImage", "test.png", "image/mpeg", "image".getBytes());
        String url = "/api/v1/user/profile/photo";
        ResultActions resultActions = mockMvc.perform(
                multipart(url).file(mockMultipartFile).contentType(MediaType.MULTIPART_FORM_DATA)
        );

        resultActions.andExpect(status().isOk());
    }
}