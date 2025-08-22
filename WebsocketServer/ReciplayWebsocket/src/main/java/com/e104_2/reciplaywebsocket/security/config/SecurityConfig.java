package com.e104_2.reciplaywebsocket.security.config;

import com.e104_2.reciplaywebsocket.security.filter.JWTFilter;
import com.e104_2.reciplaywebsocket.security.jwt.JWTUtil;
import com.e104_2.reciplaywebsocket.security.service.TokenQueryService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.access.hierarchicalroles.RoleHierarchy;
import org.springframework.security.access.hierarchicalroles.RoleHierarchyImpl;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;

import java.util.Collections;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {
    private final AuthenticationConfiguration authenticationConfiguration;
    private final JWTUtil jwtUtil;
    private final TokenQueryService tokenQueryService;
    @Value("${application.url-prefix}")
    private String URL_PREFIX;
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception{
        http.csrf(auth -> auth.disable());
        http.authorizeHttpRequests(auth -> auth
                .requestMatchers("/ws/v1/sub/**","/practice-ui.html",
                        "/swagger-ui/**", // swagger-ui 관련 모든 경로 허용
                        "/api-docs/json/**",  // openapi v3 문서 경로 허용
                        "/swagger-resources/**").permitAll()
                .anyRequest().authenticated()
        );

        // CORS 해제.
        http.cors(cors -> cors
                .configurationSource(new CorsConfigurationSource() {
                    @Override
                    public CorsConfiguration getCorsConfiguration(HttpServletRequest request) {
                        CorsConfiguration configuration = new CorsConfiguration();
                        // 허용할 오리진 설정
                        configuration.setAllowedOriginPatterns(Collections.singletonList("*"));
                        // 허용할 메서드 설정
                        configuration.setAllowedMethods(Collections.singletonList("*"));
                        // 프론트엔드에서 Credential 설정을 하면
                        configuration.setAllowCredentials(true);
                        // 허용할 헤더
                        configuration.setAllowedHeaders(Collections.singletonList("*"));
                        // 허용할 시간
                        configuration.setMaxAge(3600L);

                        // 응답의 Authorization 헤더가 토큰을 포함하니까 노출하도록 허용.
                        configuration.setExposedHeaders(Collections.singletonList("Authorization"));

                        return configuration;
                    }
                }));

        // 기본 로그인 무효화
        http.formLogin(auth -> auth.disable());

        AuthenticationManager authenticationManager = authenticationConfiguration.getAuthenticationManager();


        // 세션 무효화 정책
        http.sessionManagement(auth ->
                auth.sessionCreationPolicy(SessionCreationPolicy.STATELESS));

        JWTFilter myFilter = new JWTFilter(jwtUtil, tokenQueryService);
        http.addFilterBefore(myFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    RoleHierarchy roleHierarchy() {
        return RoleHierarchyImpl.withDefaultRolePrefix()
                .role("ADMIN").implies("INSTRUCTOR")
                .role("INSTRUCTOR").implies("STUDENT")
                .build();
    }
}
