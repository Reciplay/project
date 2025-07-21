package com.e104.reciplay.security.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        return http
                .csrf(config -> config.disable())
                .headers(headers -> headers.frameOptions(options -> options.disable()))
                .authorizeHttpRequests(config ->config
                        .requestMatchers("/**").permitAll())
                .formLogin(config->config.disable())
                .build();
    }
}
