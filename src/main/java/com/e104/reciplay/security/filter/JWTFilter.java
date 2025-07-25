package com.e104.reciplay.security.filter;

import com.e104.reciplay.security.domain.User;
import com.e104.reciplay.security.dto.CustomUserDetails;
import com.e104.reciplay.security.jwt.JWTUtil;
import com.e104.reciplay.security.service.AuthService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.HashSet;
import java.util.Set;

@Slf4j
public class JWTFilter extends OncePerRequestFilter {
    private final JWTUtil jwtUtil;
    private final Set<String> allowedUri;

    private final AuthService authService;

    public JWTFilter(JWTUtil jwtUtil, Set<String> allowedUri, AuthService authService) {
        this.jwtUtil = jwtUtil;
        this.allowedUri = allowedUri;
        this.authService = authService;
    }
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String auth = request.getHeader("Authorization");
        if(allowedUri.contains(request.getRequestURI())) {
            log.debug("Allowed uri ==== "+request.getRequestURI());
            filterChain.doFilter(request, response);
            return;
        }

        if(auth == null || !auth.startsWith("Bearer")) {
            log.debug("Token error : invalid format -> 403 Forbidden");
            filterChain.doFilter(request, response);
            return;
        }

        String token = auth.split(" ")[1];
        if(jwtUtil.isExpired(token)) {
            log.debug("Expired token -> refresh-token is needed");
            // 기간이 지난 액세스 토큰을 만료 처리해야함.
            authService.invalidateToken(token, jwtUtil.getUsername(token), "ACCESS");

            filterChain.doFilter(request, response);
            response.setStatus(401);
            return;
        }

        String username = jwtUtil.getUsername(token);
        String role = jwtUtil.getRole(token);
        if(role.isEmpty()) {
            // 리프레시 토큰으로 인증 시도하면?
            log.debug("Token error : did you try with refresh-token?");
            filterChain.doFilter(request, response);
            return;
        }

        User user = new User();
        user.setIsActivated(true);
        user.setEmail(username);
        user.setRole(role);

        CustomUserDetails userDetails = new CustomUserDetails(user);

        Authentication authentication = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
        SecurityContextHolder.getContext().setAuthentication(authentication);

        filterChain.doFilter(request, response);
    }
}
