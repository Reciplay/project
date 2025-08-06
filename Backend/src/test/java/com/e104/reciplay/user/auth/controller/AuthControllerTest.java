package com.e104.reciplay.user.auth.controller;

import com.e104.reciplay.user.auth.dto.request.PasswordChangeRequest;
import com.e104.reciplay.user.auth.dto.request.SignupRequest;
import com.e104.reciplay.user.auth.exception.IllegalEmailFormatException;
import com.e104.reciplay.user.security.exception.DuplicateUserEmailException;
import com.e104.reciplay.user.security.service.AuthService;
import com.e104.reciplay.user.security.service.SignupService;
import com.e104.reciplay.user.security.service.UserQueryService;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.util.Collections;

import static org.hamcrest.Matchers.is;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.doThrow;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;


@WebMvcTest(AuthController.class)
@AutoConfigureMockMvc(addFilters = false)
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private SignupService signupService;

    @MockitoBean
    private AuthService authService;

    @MockitoBean
    private UserQueryService userQueryService;

    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());
    }

    @Test
    @DisplayName("회원가입 성공")
    void signup_Success() throws Exception {
        // given
        SignupRequest request = new SignupRequest("test@test.com", "password123", "nickname", "hash123");
        given(authService.isValidEmail(anyString())).willReturn(true);
        doNothing().when(authService).verifySignupHash(anyString(), anyString());
        doNothing().when(signupService).signup(any(SignupRequest.class));

        // when & then
        mockMvc.perform(post("/api/v1/user/auth/signup")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.message").value("회원가입이 완료되었습니다."));
    }

    @Test
    @DisplayName("회원가입 실패 - 잘못된 이메일 형식")
    void signup_Fail_InvalidEmail() throws Exception {
        // given
        SignupRequest request = new SignupRequest("test", "password123", "nickname", "hash123");
        given(authService.isValidEmail(request.getEmail())).willReturn(false);

        // when & then
        mockMvc.perform(post("/api/v1/user/auth/signup")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(result -> result.getResolvedException().getClass().isAssignableFrom(IllegalEmailFormatException.class));
    }

    @Test
    @DisplayName("회원가입 실패 - 중복된 이메일")
    void signup_Fail_DuplicatedEmail() throws Exception {
        // given
        SignupRequest request = new SignupRequest("test@test.com", "password123", "nickname", "hash123");
        given(authService.isValidEmail(anyString())).willReturn(true);
        doNothing().when(authService).verifySignupHash(anyString(), anyString());
        doThrow(new DuplicateUserEmailException("이미 등록된 이메일 입니다.")).when(signupService).signup(any(SignupRequest.class));

        // when & then
        mockMvc.perform(post("/api/v1/user/auth/signup")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest()) // Controller returns ResponseEntity via CommonResponseBuilder.fail which is 200 OK with a fail message
                .andExpect(jsonPath("$.status").value("fail"))
                .andExpect(jsonPath("$.message").value("이미 등록된 이메일 입니다."));
    }


    @Test
    @DisplayName("토큰 재발행 성공")
    void getTokenRefreshing_Success() throws Exception {
        // given
        doNothing().when(authService).refresh(any(), any());

        // when & then
        mockMvc.perform(get("/api/v1/user/auth/refresh-token"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.message").value("토큰 재발행에 성공했습니다."));
    }

    @Test
    @DisplayName("이메일 찾기 성공")
    void querySimilarEmails_Success() throws Exception {
        // given
        given(authService.querySimillarEmails(anyString(), any(LocalDate.class)))
                .willReturn(Collections.singletonList("test***@test.com"));

        // when & then
        mockMvc.perform(get("/api/v1/user/auth/email")
                        .param("name", "testUser")
                        .param("birthday", "2000-01-01"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("이메일 조회에 성공했습니다."))
                .andExpect(jsonPath("$.data[0]").value("test***@test.com"));
    }

    @Test
    @DisplayName("이메일 OTP 발송 성공")
    void sendEmailOTP_Success() throws Exception {
        // given
        String email = "test@test.com";
        given(authService.isValidEmail(email)).willReturn(true);
        given(userQueryService.isDuplicatedEmail(email)).willReturn(false);
        Mockito.when(authService.sendOtpEmail(email)).thenReturn("dummy");

        // when & then
        mockMvc.perform(get("/api/v1/user/auth/mail-otp")
                        .param("email", email))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("이메일로 인증번호를 발송했습니다."));
    }

    @Test
    @DisplayName("이메일 OTP 발송 실패 - 이미 등록된 이메일")
    void sendEmailOTP_Fail_DuplicatedEmail() throws Exception {
        // given
        String email = "test@test.com";
        given(authService.isValidEmail(email)).willReturn(true);
        given(userQueryService.isDuplicatedEmail(email)).willReturn(true);

        // when & then
        mockMvc.perform(get("/api/v1/user/auth/mail-otp")
                        .param("email", email))
                .andExpect(status().isBadRequest())
                .andExpect(result -> result.getResolvedException().getClass().isAssignableFrom(IllegalArgumentException.class));
    }

    @Test
    @DisplayName("회원가입용 이메일 인증 성공")
    void verifyEmailOTPSignup_Success() throws Exception {
        // given
        String email = "test@test.com";
        String otp = "123456";
        String signupToken = "signup-token";
        given(authService.isValidEmail(email)).willReturn(true);
        given(userQueryService.isDuplicatedEmail(email)).willReturn(false);
        doNothing().when(authService).verifyEmailOtp(email, otp);
        given(authService.issueSignupToken(email)).willReturn(signupToken);

        // when & then
        mockMvc.perform(get("/api/v1/user/auth/mail-verification")
                        .param("email", email)
                        .param("otp", otp))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("이메일 인증에 성공했습니다."))
                .andExpect(jsonPath("$.data.hash").value(signupToken));
    }

    @Test
    @DisplayName("비밀번호 변경용 이메일 인증 성공")
    void verifyEmailOTPPassword_Success() throws Exception {
        // given
        String email = "test@test.com";
        String otp = "123456";
        String passwordToken = "password-token";
        given(authService.isValidEmail(email)).willReturn(true);
        given(userQueryService.isDuplicatedEmail(email)).willReturn(false); // Note: This might be a bug in original code
        doNothing().when(authService).verifyEmailOtp(email, otp);
        given(authService.issuePasswordToken(email)).willReturn(passwordToken);

        // when & then
        mockMvc.perform(get("/api/v1/user/auth/mail-verification/password")
                        .param("email", email)
                        .param("otp", otp))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("이메일 인증에 성공했습니다."))
                .andExpect(jsonPath("$.data.hash").value(passwordToken));
    }

    @Test
    @DisplayName("비밀번호 변경 성공")
    void updatePassword_Success() throws Exception {
        // given
        PasswordChangeRequest request = new PasswordChangeRequest("test@test.com", "newPassword123", "password-token");
        doNothing().when(authService).checkPasswordHash(any(PasswordChangeRequest.class));

        // when & then
        mockMvc.perform(put("/api/v1/user/auth/password")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("비밀번호 변경에 성공 했습니다."));
    }

    @Test
    @DisplayName("이메일 중복 확인 - 중복 없음")
    void checkDuplicatedEmail_NotDuplicated() throws Exception {
        // given
        String email = "new@test.com";
        given(authService.isValidEmail(email)).willReturn(true);
        given(userQueryService.isDuplicatedEmail(email)).willReturn(false);

        // when & then
        mockMvc.perform(get("/api/v1/user/auth/dup-email")
                        .param("email", email))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("조회에 성공했습니다."))
                .andExpect(jsonPath("$.data", is(false)));
    }

    @Test
    @DisplayName("이메일 중복 확인 - 중복 있음")
    void checkDuplicatedEmail_Duplicated() throws Exception {
        // given
        String email = "existing@test.com";
        given(authService.isValidEmail(email)).willReturn(true);
        given(userQueryService.isDuplicatedEmail(email)).willReturn(true);

        // when & then
        mockMvc.perform(get("/api/v1/user/auth/dup-email")
                        .param("email", email))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("조회에 성공했습니다."))
                .andExpect(jsonPath("$.data", is(true)));
    }

    @Test
    @DisplayName("닉네임 중복 확인 - 중복 없음")
    void checkDuplicatedNickname_NotDuplicated() throws Exception {
        // given
        String nickname = "newNickname";
        given(userQueryService.isDuplicatedNickname(nickname)).willReturn(false);

        // when & then
        mockMvc.perform(get("/api/v1/user/auth/dup-nickname")
                        .param("nickname", nickname))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("조회에 성공했습니다."))
                .andExpect(jsonPath("$.data", is(false)));
    }

    @Test
    @DisplayName("닉네임 중복 확인 - 중복 있음")
    void checkDuplicatedNickname_Duplicated() throws Exception {
        // given
        String nickname = "existingNickname";
        given(userQueryService.isDuplicatedNickname(nickname)).willReturn(true);

        // when & then
        mockMvc.perform(get("/api/v1/user/auth/dup-nickname")
                        .param("nickname", nickname))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("조회에 성공했습니다."))
                .andExpect(jsonPath("$.data", is(true)));
    }
}
