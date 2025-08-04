package com.e104.reciplay.livekit.config;

import io.livekit.server.RoomServiceClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class LivekitConfig {
    @Value("${livekit.api.key}")
    private String LIVEKIT_API_KEY;

    @Value("${livekit.api.secret}")
    private String LIVEKIT_API_SECRET;

    @Value("${livekit.server.url}")
    private String LIVEKIT_SERVER_URL;

    @Bean
    public RoomServiceClient roomServiceClient() {
        RoomServiceClient client = RoomServiceClient.createClient(
                LIVEKIT_SERVER_URL, LIVEKIT_API_KEY, LIVEKIT_API_SECRET
        );

        return client;
    }
}
