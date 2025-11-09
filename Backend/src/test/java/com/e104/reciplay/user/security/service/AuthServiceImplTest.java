package com.e104.reciplay.user.security.service;

import com.e104.reciplay.user.auth.dto.request.PasswordChangeRequest;
import com.e104.reciplay.user.auth.exception.EmailAuthFailureException;
import com.e104.reciplay.user.auth.exception.InvalidOtpHashException;
import com.e104.reciplay.user.auth.mail.service.MailService;
import com.e104.reciplay.user.auth.redis.AuthRedisService;

import com.e104.reciplay.user.security.domain.Token;
import com.e104.reciplay.user.security.domain.User;
import com.e104.reciplay.user.security.exception.JWTTokenExpiredException;
import com.e104.reciplay.user.security.jwt.JWTUtil;
import com.e104.reciplay.user.security.repository.TokenRepository;
import com.e104.reciplay.user.security.repository.UserRepository;
import jakarta.servlet.http.Cookie;

import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.junit.jupiter.api.Disabled;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@SpringBootTest
@Transactional
@ActiveProfiles(value = {"test"})
class AuthServiceImplTest {
    @Autowired
    private AuthServiceImpl authService;
    @Autowired
    private AuthRedisService authRedisService;
    @Autowired
    private TokenRepository tokenRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private JWTUtil jwtUtil;
    @Autowired
    private SignupService signupService;


    @Autowired
    private BCryptPasswordEncoder encoder;

    @MockitoBean
    private MailService mailService;

    private User testUser;

    @BeforeEach
    void setUp() {
        userRepository.deleteAll();
        testUser = User.builder().email("test@email.com")
                                .job("개발자")
                                .gender(1)
                                .birthDate(LocalDate.of(2000, 2, 6))
                                .name("이원준").isActivated(true).nickname("molee")
                .role("ROLE_INSTRUCTOR").build();
        userRepository.save(testUser);
    }

    @AfterEach
    void tearDown() {
        userRepository.deleteAll();
    }


    @Test
    @DisplayName("액세스 토큰 재발급 성공")
    void refresh_success() {
        // given
        String refreshToken = jwtUtil.createJwt(testUser.getEmail(), testUser.getRole(), 10000L);

        tokenRepository.save(new Token(null, refreshToken, false, "REFRESH", null, testUser.getEmail()));

        MockHttpServletRequest request = new MockHttpServletRequest();
        request.addHeader("Refresh-Token", refreshToken);
        MockHttpServletResponse response = new MockHttpServletResponse();

        // when
        authService.refresh(request, response);

        // then
        String newAccessToken = response.getHeader("Authorization");
        assertThat(newAccessToken).startsWith("Bearer ");
        String token = newAccessToken.split(" ")[1];
        assertThat(jwtUtil.isExpired(token)).isFalse();
        assertThat(jwtUtil.getUsername(token)).isEqualTo(testUser.getEmail());

        Token savedToken = tokenRepository.findValidTokenByPlainAndUsername("", testUser.getEmail(), "ACCESS");
        assertThat(savedToken.getIsExpired()).isFalse(); // New Access Token, Refresh Token
    }

    @Test
    @DisplayName("리프레시 토큰이 없으면 토큰 재발급 실패")
    void refresh_fail_no_token() {
        // given
        MockHttpServletRequest request = new MockHttpServletRequest();
        MockHttpServletResponse response = new MockHttpServletResponse();

        // when & then
        assertThatThrownBy(() -> authService.refresh(request, response))
                .isInstanceOf(JWTTokenExpiredException.class)
                .hasMessage("헤더에 토큰이 없거나 만료 혹은 거부되었습니다.");
    }

    @Test
    @DisplayName("모든 토큰 무효화 성공")
    void invalidateAllTokens_success() {
        // given
        tokenRepository.save(new Token(null, "token1", false, "ACCESS", null, testUser.getEmail()));
        tokenRepository.save(new Token(null, "token2", false, "REFRESH", null, testUser.getEmail()));

        // when
        authService.invalidateAllTokens(testUser.getEmail());

        // then
        assertThat(tokenRepository.findValidTokenByPlainAndUsername("", testUser.getEmail(), "ACCESS")).isNull();
        assertThat(tokenRepository.findValidTokenByPlainAndUsername("", testUser.getEmail(), "REFRESH")).isNull();
    }

    @Test
    @DisplayName("특정 토큰 무효화 성공")
    void invalidateToken_success() {
        // given
        String tokenPlain = "access_token_to_invalidate";
        tokenRepository.save(new Token(null, tokenPlain, false, "ACCESS", null, testUser.getEmail()));

        // when
        authService.invalidateToken(tokenPlain, testUser.getEmail(), "ACCESS");

        // then
        Token token = tokenRepository.findValidTokenByPlainAndUsername(tokenPlain, testUser.getEmail(), "ACCESS");
        assertThat(token).isNull();
    }

    @Test
    @DisplayName("새 토큰 발급 성공")
    void issueNewToken_success() {
        // given
        String tokenPlain = "new_access_token";

        // when
        authService.issueNewToken(tokenPlain, testUser.getEmail(), "ACCESS");

        // then
        Token token = tokenRepository.findValidTokenByPlainAndUsername(tokenPlain, testUser.getEmail(), "ACCESS");
        assertThat(token).isNotNull();
        assertThat(token.getIsExpired()).isFalse();
    }

    @Test
    @DisplayName("OTP 생성 성공")
    void generateOTP_success() {
        // when
        String otp = authService.generateOTP();

        // then
        assertThat(otp).isNotNull().isNotEmpty();
    }

    @Test
    @DisplayName("이메일 유효성 검사")
    void isValidEmail_test() {
        assertThat(authService.isValidEmail("test@test.com")).isTrue();
        assertThat(authService.isValidEmail("test@test")).isFalse();
        assertThat(authService.isValidEmail("test.com")).isFalse();
        assertThat(authService.isValidEmail(null)).isFalse();
        assertThat(authService.isValidEmail("")).isFalse();
    }

    @Test
    @DisplayName("OTP 이메일 발송 및 검증 성공")
    void sendOtpEmail_and_verifyEmailOtp_success() {
        // given
        String email = "test@example.com";
        when(mailService.formAuthEmailText(anyString(), anyString())).thenReturn("Simple message");
        doNothing().when(mailService).sendSimpleMailMessage(anyString(), anyString(), anyString());

        // when
        String otp = authService.sendOtpEmail(email);

        // then
        assertThat(otp).isNotNull();
        verify(mailService, times(1)).sendSimpleMailMessage(eq(email), anyString(), anyString());

        // when (verify)
        authService.verifyEmailOtp(email, otp);

        // then (no exception)
    }

    @Test
    @DisplayName("잘못된 OTP 검증 시 실패")
    void verifyEmailOtp_fail() {
        // given
        String email = "test@example.com";
        authRedisService.registAuthToken("email", email, "correct_otp", 3);

        // when & then
        assertThatThrownBy(() -> authService.verifyEmailOtp(email, "wrong_otp"))
                .isInstanceOf(EmailAuthFailureException.class);
    }

    @Test
    @DisplayName("회원가입 토큰 발급 및 검증 성공")
    void issueSignupToken_and_verifySignupHash_success() {
        // given
        String email = "signup@example.com";

        // when
        String signupToken = authService.issueSignupToken(email);

        // when (verify)
        authService.verifySignupHash(email, signupToken);

        // then (no exception)
    }

    @Test
    @DisplayName("잘못된 회원가입 토큰 검증 시 실패")
    void verifySignupHash_fail() {
        // given
        String email = "signup@example.com";
        authRedisService.registAuthToken("signup", email, "correct_hash", 3);

        // when & then
        assertThatThrownBy(() -> authService.verifySignupHash(email, "wrong_hash"))
                .isInstanceOf(InvalidOtpHashException.class);
    }

    @Test
    @DisplayName("비밀번호 변경 토큰 발급 및 변경 성공")
    void issuePasswordToken_and_changePassword_success() {
        // given
        String email = testUser.getEmail();
        String newPassword = "newPasw!13214sa23";

        // when
        String passwordToken = authService.issuePasswordToken(email);

        // when (change password)
        PasswordChangeRequest request = new PasswordChangeRequest(email, newPassword, passwordToken);

        Assertions.assertDoesNotThrow(() -> authService.checkPasswordHash(request));

        signupService.changePassword(request.getEmail(), request.getNewPassword());
        // then
        User updatedUser = userRepository.findByEmail(email).get();
        // Note: In a real scenario, password should be encoded.
        // Here we assume SignupService handles encoding.
        assertThat(encoder.matches(request.getNewPassword(), updatedUser.getPassword())).isTrue();
    }

    @Test
    @DisplayName("유사 이메일 조회 성공")
    void querySimillarEmails_success() {
        // given
        String name = testUser.getName();
        LocalDate birthDay = testUser.getBirthDate();

        // when
        List<String> emails = authService.querySimillarEmails(name, birthDay);

        // then
        assertThat(emails).hasSize(1);
        assertThat(emails.get(0)).isEqualTo(authService.hideSensitive(testUser.getEmail()));
    }

    @Test
    @DisplayName("로그아웃 성공")
    void logout_success() {
        // given
        String accessToken = jwtUtil.createJwt(testUser.getEmail(), "ROLE_USER", 600000L);
        tokenRepository.save(new Token(null, accessToken, false, "ACCESS", null, testUser.getEmail()));

        MockHttpServletRequest request = new MockHttpServletRequest();
        request.addHeader("Authorization", "Bearer " + accessToken);
        MockHttpServletResponse response = new MockHttpServletResponse();
        Authentication authentication = mock(Authentication.class);

        // when
        authService.logout(request, response, authentication);

        // then
        List<Token> tokens = tokenRepository.findByUsernameAndIsExpired(testUser.getEmail(), false);
        assertThat(tokens).isEmpty();
    }

    @Test
    @DisplayName("이메일 가리기 성공")
    public void 이메일_가리기에_성공한다() {
        String email = "wonjun@naver.com";
        String processed = authService.hideSensitive(email);
        assertThat(processed).isEqualTo("w*****@naver.com");
    }
}
