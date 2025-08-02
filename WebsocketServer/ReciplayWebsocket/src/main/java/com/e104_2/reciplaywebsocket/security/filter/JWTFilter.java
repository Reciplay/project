package com.e104_2.reciplaywebsocket.security.filter;

import com.e104_2.reciplaywebsocket.security.dto.CustomUserDetails;
import com.e104_2.reciplaywebsocket.security.jwt.JWTUtil;
import com.e104_2.reciplaywebsocket.security.service.TokenQueryService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;
import java.util.List;
import java.io.IOException;

@Slf4j
public class JWTFilter extends OncePerRequestFilter {
    private JWTUtil jwtUtil;
    private TokenQueryService tokenQueryService;

    public JWTFilter(JWTUtil jwtUtil, TokenQueryService tokenQueryService) {
        this.jwtUtil = jwtUtil;
        this.tokenQueryService = tokenQueryService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String auth = request.getHeader("Authorization");
        if(auth == null || !auth.startsWith("Bearer")) {
            log.warn("토큰 없는 접근으로 처리되었습니다.");
            filterChain.doFilter(request, response);
            return;
        }

        String token = auth.split(" ")[1];

        if(token == null || token.isEmpty()) {
            log.warn("토큰 없는 접근으로 처리되었습니다.");
            filterChain.doFilter(request, response);
            return;
        }

        if(jwtUtil.isExpired(token)) {
            log.warn("액세스 토큰이 만료되었습니다.");
            filterChain.doFilter(request, response);
            return;
        }

        if(tokenQueryService.isInvalidToken(token)) {
            log.warn("해당 토큰은 이미 처분되었습니다.");
            filterChain.doFilter(request, response);
            return;
        }

        String username = jwtUtil.getUsername(token);
        String role = jwtUtil.getRole(token);
        CustomUserDetails principal = new CustomUserDetails();
        principal.setUsername(username);
        principal.setRole(role);
        Authentication authentication = new UsernamePasswordAuthenticationToken(principal, null, List.of(new SimpleGrantedAuthority(role)));
        SecurityContextHolder.getContext().setAuthentication(authentication);

        filterChain.doFilter(request, response);
    }
}
