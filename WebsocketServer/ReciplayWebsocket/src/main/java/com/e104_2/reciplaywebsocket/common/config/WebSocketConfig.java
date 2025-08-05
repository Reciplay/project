package com.e104_2.reciplaywebsocket.common.config;

import com.e104_2.reciplaywebsocket.room.config.StompAuthenticationChannelInterceptor;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketTransportRegistration;

@Configuration
@EnableWebSocketMessageBroker // WebSocket 메시지 브로커를 활성화합니다.
@RequiredArgsConstructor
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {
    @Value("${application.url-prefix}")
    private String URI_PREFIX;
    private final StompAuthenticationChannelInterceptor stompAuthenticationChannelInterceptor;
    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // /ws 경로로 WebSocket 연결을 허용하고, 모든 도메인에서의 접근을 허용합니다.
        registry.addEndpoint(URI_PREFIX + "/sub")
                .setAllowedOriginPatterns("*").withSockJS();
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        registry.enableSimpleBroker(URI_PREFIX + "/topic", URI_PREFIX + "/queue");
        ///queue는 반드시 INSTRUCTOR ROLE만 허용할 것.
        registry.setApplicationDestinationPrefixes(URI_PREFIX + "/app");
        registry.setUserDestinationPrefix(URI_PREFIX + "/user");

        // 클라이언트측(강사)는 subscribe("/instructor/queue/lectureID") 로 구독한다.
        // 회원은 send("/app/student")로 전송한다.
        // 핸들러가 convertAndSendToUser(강사이메일, "/queue/lectureID")로 전송한다.
    }

    @Override
    public void configureWebSocketTransport(WebSocketTransportRegistration registry) {
        registry.setMessageSizeLimit(4 * 8192); // 메세지 최대 길이 = 32KB
        registry.setTimeToFirstMessage(30000); // 30초 동안 최초 메세지 대기
    }

    @Override
    public void configureClientInboundChannel(ChannelRegistration registration) {
        registration.interceptors(stompAuthenticationChannelInterceptor);
    }
}
