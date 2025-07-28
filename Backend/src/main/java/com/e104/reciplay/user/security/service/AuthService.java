package com.e104.reciplay.user.security.service;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.logout.LogoutHandler;

public interface AuthService extends LogoutHandler {
    // logout 핸들러 역할도 함.
    void refresh(HttpServletRequest request, HttpServletResponse response);

    void invalidateAllTokens(String username);
    void invalidateToken(String plain, String username, String type);
    void issueNewToken(String plain, String username, String type);
}
