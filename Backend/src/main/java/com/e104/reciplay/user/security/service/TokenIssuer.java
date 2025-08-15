//package com.e104.reciplay.user.security.service;
//
//import com.e104.reciplay.user.security.jwt.JWTUtil;
//import com.fasterxml.jackson.databind.ObjectMapper;
//import jakarta.servlet.http.Cookie;
//import jakarta.servlet.http.HttpServletResponse;
//import lombok.RequiredArgsConstructor;
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.stereotype.Component;
//
//import java.io.IOException;
//import java.util.Map;
//
//@Component
//@RequiredArgsConstructor
//public class TokenIssuer {
//
//    private final JWTUtil jwtUtil;
//    private final AuthService authService;
//    private final ObjectMapper objectMapper;
//    private final UserQueryService userQueryService;
//
//    @Value("${spring.jwt.expiration}")
//    private long ACCESS_TOKEN_EXPIRATION;
//
//    @Value("${spring.jwt.refresh-token.expiration}")
//    private long REFRESH_TOKEN_EXPIRATION;
//
//    public void issueAndWrite(HttpServletResponse response, String email, String role) throws IOException {
//        // 1) 기존 토큰 무효화
//        authService.invalidateAllTokens(email);
//
//        // 2) 토큰 발급
//        String accessToken = jwtUtil.createJwt(email, role, ACCESS_TOKEN_EXPIRATION);
//        String refreshToken = jwtUtil.createJwt(email, null, REFRESH_TOKEN_EXPIRATION);
//
//        // 3) 저장
//        authService.issueNewToken(accessToken, email, "ACCESS");
//        authService.issueNewToken(refreshToken, email, "REFRESH");
//
//        // 4) 헤더/쿠키
//        response.addHeader("Authorization", "Bearer " + accessToken);
//        Cookie cookie = new Cookie("refresh-token", refreshToken);
//        cookie.setPath("/");
//        cookie.setHttpOnly(true);
//        cookie.setMaxAge((int) (REFRESH_TOKEN_EXPIRATION / 1000));
//        response.addCookie(cookie);
//
//        // 5) 응답 JSON (지금 폼 로그인 응답 포맷과 동일)
//        Map<String, String> userInfo = Map.of(
//                "email", email,
//                "role", role,
//                "required", isFulfillAdditionalInfos(email).toString()
//        );
//        response.setContentType("application/json;charset=UTF-8");
//        response.getWriter().write(objectMapper.writeValueAsString(userInfo));
//    }
//
//    private Boolean isFulfillAdditionalInfos(String email) {
//        try {
//            return userQueryService.queryUserByEmail(email).getBirthDate() == null;
//        } catch (Exception e) {
//            // 새 가입자 등 조회 실패 시 추가정보 필요로 간주
//            return true;
//        }
//    }
//}
