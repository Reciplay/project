package com.e104.reciplay.user.security.filter;

import com.e104.reciplay.user.security.jwt.JWTUtil;
import com.e104.reciplay.user.security.service.AuthService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import java.io.IOException;

public class CustomLoginFilter extends UsernamePasswordAuthenticationFilter {
    private final AuthenticationManager authenticationManager;
    private final JWTUtil jwtUtil;

    private final long ACCESS_TOKEN_EXPIRATION;
    private final long REFRESH_TOKEN_EXPIRATION;

    private final AuthService authService;

    public CustomLoginFilter(AuthenticationManager authenticationManager,
                             JWTUtil jwtUtil,
                             long access_token_expiration,
                             long refresh_token_expiration,
                             AuthService authService) {
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
        this.ACCESS_TOKEN_EXPIRATION = access_token_expiration;
        this.REFRESH_TOKEN_EXPIRATION = refresh_token_expiration;
        this.authService = authService;
    }

    @Override
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response) throws AuthenticationException {
        String username = super.obtainUsername(request);
        String password = super.obtainPassword(request);

        // 인증 객체를 만들고
        UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(username, password, null);
        // 인증 수행하기

        // 인증 결과 리턴
        return this.authenticationManager.authenticate(authToken);
    }

    @Override
    protected void successfulAuthentication(HttpServletRequest request, HttpServletResponse response, FilterChain chain, Authentication authResult) throws IOException, ServletException {
        String username = authResult.getName();
        String role = authResult.getAuthorities().iterator().next().getAuthority();

        // 기존 토큰을 모두 제거합니다.
        authService.invalidateAllTokens(username);

        // 로그인 성공시 리프레시 토큰을 발급합니다.
        String accessToken = jwtUtil.createJwt(username, role, ACCESS_TOKEN_EXPIRATION);
        String refreshToken = jwtUtil.createJwt(username, null, REFRESH_TOKEN_EXPIRATION);

        //
        authService.issueNewToken(accessToken, username, "ACCESS");
        authService.issueNewToken(refreshToken, username, "REFRESH");

        response.addHeader("Authorization", "Bearer " + accessToken);
        response.addCookie(new Cookie("refresh-token", refreshToken));
    }

    @Override
    protected void unsuccessfulAuthentication(HttpServletRequest request, HttpServletResponse response, AuthenticationException failed) throws IOException, ServletException {
        // status 401
        response.setStatus(401);
    }
}
