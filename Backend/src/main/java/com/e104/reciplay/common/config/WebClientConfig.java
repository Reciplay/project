package com.e104.reciplay.common.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
public class WebClientConfig {
    @Value("${ai.llm.baseurl}")
    private String BASE_URL;

    @Value("${ai.llm.codec-size}")
    private int CODEC_SIZE;
    private final int KB = 1000;

    // 챗봇에 요청하기 위한 API
    @Bean
    public WebClient chatBotClient(WebClient.Builder builder) {
        return builder.baseUrl(BASE_URL)
                .codecs(config -> {
                    config.defaultCodecs().maxInMemorySize(CODEC_SIZE * KB);
                }).build();
    }
}
