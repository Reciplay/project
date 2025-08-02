package com.e104_2.reciplaywebsocket.common.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketTransportRegistration;

@Configuration
@EnableWebSocketMessageBroker // WebSocket 메시지 브로커를 활성화합니다.
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    /**
     * STOMP 엔드포인트를 등록합니다.
     * 클라이언트가 WebSocket 연결을 맺을 때 사용할 URL을 정의합니다.
     * @param registry STOMP 엔드포인트 레지스트리
     */
    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // /ws 경로로 WebSocket 연결을 허용하고, 모든 도메인에서의 접근을 허용합니다.
        registry.addEndpoint("/ws").setAllowedOriginPatterns("*").withSockJS();
    }

    /**
     * 메시지 브로커를 구성합니다.
     * 클라이언트에게 메시지를 전송할 때 사용할 접두사와 애플리케이션이 메시지를 수신할 때 사용할 접두사를 정의합니다.
     * @param registry 메시지 브로커 레지스트리
     */
    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        // /topic으로 시작하는 메시지는 브로커로 라우팅되어 구독자에게 전송됩니다.
        registry.enableSimpleBroker("/topic", "/instructor");
        // /app으로 시작하는 메시지는 @MessageMapping 어노테이션이 달린 컨트롤러 메서드로 라우팅됩니다.
        registry.setApplicationDestinationPrefixes("/appp");
    }

    @Override
    public void configureWebSocketTransport(WebSocketTransportRegistration registry) {
        registry.setMessageSizeLimit(4 * 8192); // 메세지 최대 길이 = 32KB
        registry.setTimeToFirstMessage(30000); // 30초 동안 최초 메세지 대기
    }
}
