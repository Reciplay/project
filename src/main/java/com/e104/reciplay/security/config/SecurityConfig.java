package com.e104.reciplay.security.config;

import com.e104.reciplay.security.filter.CustomLoginFilter;
import com.e104.reciplay.security.filter.JWTFilter;
import com.e104.reciplay.security.jwt.JWTUtil;
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
