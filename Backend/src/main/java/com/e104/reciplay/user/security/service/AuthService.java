package com.e104.reciplay.user.security.service;

import com.e104.reciplay.user.auth.dto.request.PasswordChangeRequest;
import com.e104.reciplay.user.auth.dto.request.SignupRequest;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.logout.LogoutHandler;

import java.time.LocalDate;
import java.util.List;

public interface AuthService extends LogoutHandler {
    // logout 핸들러 역할도 함.
    void refresh(HttpServletRequest request, HttpServletResponse response);

    void invalidateAllTokens(String username);
    void invalidateToken(String plain, String username, String type);
    void issueNewToken(String plain, String username, String type);
    boolean validateToken(String plain, String username, String type);

    String generateOTP();

    Boolean isValidEmail(String email);

    String sendOtpEmail(String email);

    void verifyEmailOtp(String email, String otp);

    String issueSignupToken(String email);

    String issuePasswordToken(String email);

    void checkPasswordHash(PasswordChangeRequest request);

    void verifySignupHash(String email, String hash);

    List<String> querySimillarEmails(String name, LocalDate birthDay);
}
