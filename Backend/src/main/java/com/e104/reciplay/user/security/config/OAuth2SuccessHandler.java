package com.e104.reciplay.user.security.config;

import com.e104.reciplay.user.security.jwt.JWTUtil;
import com.e104.reciplay.user.security.service.AuthService;
import com.e104.reciplay.user.security.service.UserQueryService; // ← 추가
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.util.Map;

@Component
@RequiredArgsConstructor
@Slf4j
public class OAuth2SuccessHandler implements AuthenticationSuccessHandler {

    private final JWTUtil jwtUtil;
    private final AuthService authService;
    private final UserQueryService userQueryService; // ← 추가

    @Value("${spring.jwt.expiration}")
    private long ACCESS_TOKEN_EXPIRATION;

    @Value("${spring.jwt.refresh-token.expiration}")
    private long REFRESH_TOKEN_EXPIRATION;

    @Value("${app.oauth2.front-callback-url}")
    private String frontCallbackUrl;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication) throws IOException {

        OAuth2User principal = (OAuth2User) authentication.getPrincipal();

        log.debug("[OAuth2] attributes keys={}", principal.getAttributes().keySet());
        String email = attrAsString(principal.getAttributes().get("email"));
        if (email == null) {
            Object kakaoAccount = principal.getAttributes().get("kakao_account");
            if (kakaoAccount instanceof Map<?,?> m) email = attrAsString(m.get("email"));
        }
        if (email == null) {
            Object naverResp = principal.getAttributes().get("response");
            if (naverResp instanceof Map<?,?> m) email = attrAsString(m.get("email"));
        }
        if (email == null || email.isBlank()) {
            log.warn("[OAuth2] email not provided by provider. attrs={}", principal.getAttributes());
            response.setStatus(HttpStatus.BAD_REQUEST.value());
            response.setContentType("application/json;charset=UTF-8");
            response.getWriter().write("{\"error\":\"email not provided by provider\"}");
            return;
        }
        log.debug("[OAuth2] resolved email={}", email);

        // 권한
        String role = authentication.getAuthorities().stream()
                .findFirst().map(GrantedAuthority::getAuthority).orElse("ROLE_STUDENT");
        log.debug("[OAuth2] resolved role={}", role);

        // 기존 토큰 무효화 후 재발급
        log.debug("[OAuth2] invalidateAllTokens(email={})", email);
        authService.invalidateAllTokens(email);

        log.debug("[OAuth2] issuing tokens (accessExpMs={}, refreshExpMs={})",
                ACCESS_TOKEN_EXPIRATION, REFRESH_TOKEN_EXPIRATION);
        String accessToken  = jwtUtil.createJwt(email, role, ACCESS_TOKEN_EXPIRATION);
        String refreshToken = jwtUtil.createJwt(email, null,  REFRESH_TOKEN_EXPIRATION);

        authService.issueNewToken(accessToken,  email, "ACCESS");
        authService.issueNewToken(refreshToken, email, "REFRESH");
        log.debug("[OAuth2] tokens stored. at(masked)={}, rt(masked)={}",
                mask(accessToken), mask(refreshToken));

        // 헤더/쿠키(선택)
        response.addHeader("Authorization", "Bearer " + accessToken);
        Cookie cookie = new Cookie("refresh-token", refreshToken);
        cookie.setPath("/");
        cookie.setHttpOnly(true);
        cookie.setMaxAge((int)(REFRESH_TOKEN_EXPIRATION/1000));
        response.addCookie(cookie);

        // 추가정보 필요 여부 계산 (DB에 유저가 없거나 birthDate가 비어있으면 true)
        boolean required = isAdditionalInfoRequired(email);
        log.debug("[OAuth2] required(additional-info)={}", required);

        // 프론트 콜백으로 email / AT / RT / role / required 전달
        String redirectUrl = UriComponentsBuilder.fromUriString(frontCallbackUrl)
                .queryParam("email", email)
                .queryParam("accessToken", "Bearer " + accessToken)
                .queryParam("refreshToken", refreshToken)
                .queryParam("role", role)
                .queryParam("required", isAdditionalInfoRequired(email)) // boolean
                .build().toUriString();


        log.debug("[OAuth2] redirecting to frontCallbackUrl={} (email={}, AT/RT masked in logs)",
                frontCallbackUrl, email);
        response.sendRedirect(redirectUrl);
    }

    private boolean isAdditionalInfoRequired(String email) {
        try {
            var user = userQueryService.queryUserByEmail(email);
            if (user == null) return true;          // 소셜 첫 로그인 등
            return user.getBirthDate() == null;     // 기존 방식과 동일
        } catch (Exception e) {
            log.warn("[OAuth2] required check failed for email={}, fallback=true, ex={}", email, e.toString());
            return true;
        }
    }

    private String attrAsString(Object v) { return v == null ? null : String.valueOf(v); }
    private String mask(String token) {
        if (token == null) return "null";
        int n = token.length();
        if (n <= 10) return "****";
        return token.substring(0, 10) + "...(len=" + n + ")";
    }
}
