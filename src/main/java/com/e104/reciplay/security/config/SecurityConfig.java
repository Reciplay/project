package com.e104.reciplay.security.config;

import com.e104.reciplay.security.filter.CustomLoginFilter;
import com.e104.reciplay.security.filter.JWTFilter;
import com.e104.reciplay.security.jwt.JWTUtil;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;

import java.util.Collections;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {
    @Value("${application.url-prefix}")
    private String URL_PREFIX;
    private final AuthenticationConfiguration authenticationConfiguration;
    private final JWTUtil jwtUtil;


    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }

    @Bean
    public BCryptPasswordEncoder bCryptPasswordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.csrf(auth -> auth.disable());
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

        http.headers(headers -> headers.frameOptions(frameOptions -> frameOptions.sameOrigin()));

        http.authorizeHttpRequests(auth -> auth
                .requestMatchers(URL_PREFIX + "/login",
                                 URL_PREFIX + "/signup",
                                 "/h2-console/**",
                                 "/practice-ui.html",
                                 "/swagger-ui/**", // swagger-ui 관련 모든 경로 허용
                                 "/api-docs/json/**",  // openapi v3 문서 경로 허용
                                 "/swagger-resources/**").permitAll()
                .requestMatchers(URL_PREFIX + "/admin").hasRole("ADMIN")
                .anyRequest().authenticated());

        http.formLogin(auth -> auth.disable());

        // 커스텀 필터를 addFilterAt 해줘야 함.
        CustomLoginFilter customLoginFilter = new CustomLoginFilter(authenticationManager(authenticationConfiguration), jwtUtil);
        customLoginFilter.setFilterProcessesUrl(URL_PREFIX + "/login");

        http.addFilterAt(
                customLoginFilter,
                UsernamePasswordAuthenticationFilter.class
        );

        http.addFilterBefore(new JWTFilter(jwtUtil), CustomLoginFilter.class);

        // 가장 중요한 처리 : 세션을 생성하지 않도록 함.
        http.sessionManagement(auth -> auth.sessionCreationPolicy(SessionCreationPolicy.STATELESS));

        return http.build();
    }
}
