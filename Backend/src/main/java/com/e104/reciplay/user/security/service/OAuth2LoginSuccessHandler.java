//package com.e104.reciplay.user.security.service;
//
//import com.e104.reciplay.user.security.dto.CustomUserDetails;
//import com.e104.reciplay.user.security.jwt.JWTUtil;
//import jakarta.servlet.ServletException;
//import jakarta.servlet.http.HttpServletRequest;
//import jakarta.servlet.http.HttpServletResponse;
//import lombok.RequiredArgsConstructor;
//import org.springframework.security.core.Authentication;
//import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
//import org.springframework.stereotype.Component;
//
//import java.io.IOException;
//
//@Component
//@RequiredArgsConstructor
//public class OAuth2LoginSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {
//
//    private final JWTUtil jwtUtil;
//
//    @Override
//    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
//        CustomUserDetails oAuth2User = (CustomUserDetails) authentication.getPrincipal();
//
//        String token = jwtUtil.createJwt(oAuth2User.getUsername(), oAuth2User.getAuthorities().iterator().next().getAuthority(), 60 * 60 * 60 * 60L);
//
//        String redirectUrl = "http://localhost:3000/oauth2/redirect?token=" + token; // URL of the frontend
//        getRedirectStrategy().sendRedirect(request, response, redirectUrl);
//    }
//}
