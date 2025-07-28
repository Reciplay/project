package com.e104.reciplay.swagger.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.OpenAPI;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import javax.management.StringValueExp;

@Configuration
public class SwaggerConfig implements WebMvcConfigurer {
    private static final String TITLE = "Reciplay API 문서";
    private static final String VERSION = "0.0.1";
    private static final String DESCRIPTION = "SSAFY 13기 부울경 공통 1반 E104팀 프로젝트.";
    @Bean
    public OpenAPI openAPI() {
        Info info = new Info().title(TITLE).version(VERSION).description(DESCRIPTION);
        return new OpenAPI().components(new Components()).info(info);
    }
}
