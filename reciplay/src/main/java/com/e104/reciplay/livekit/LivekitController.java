package com.e104.reciplay.livekit;

import io.livekit.server.AccessToken;
import io.livekit.server.RoomJoin;
import io.livekit.server.RoomName;
import io.livekit.server.WebhookReceiver;
import livekit.LivekitWebhook.WebhookEvent;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/livekit")
public class LivekitController {

    @Value("${livekit.api.key}")
    private String LIVEKIT_API_KEY;

    @Value("${livekit.api.secret}")
    private String LIVEKIT_API_SECRET;

    private final SimpMessagingTemplate messagingTemplate;

    public LivekitController(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    /**
     * LiveKit 토큰을 생성하는 엔드포인트.
     * 클라이언트가 LiveKit 방에 참여하기 위해 필요한 JWT 토큰을 반환합니다.
     * @param params JSON 객체 (roomName: 방 이름, participantName: 참가자 이름)
     * @return JWT 토큰을 포함하는 JSON 객체
     */
    @PostMapping("/token")
    public ResponseEntity<Map<String, String>> createToken(@RequestBody Map<String, String> params) {
        String roomName = params.get("roomName");
        String participantName = params.get("participantName");

        if (roomName == null || participantName == null) {
            return ResponseEntity.badRequest().body(Map.of("errorMessage", "roomName and participantName are required"));
        }

        // LiveKit AccessToken 생성
        AccessToken token = new AccessToken(LIVEKIT_API_KEY, LIVEKIT_API_SECRET);
        token.setName(participantName);
        token.setIdentity(participantName);
        // 방 참여 권한 부여
        token.addGrants(new RoomJoin(true), new RoomName(roomName));

        // 생성된 토큰 반환
        return ResponseEntity.ok(Map.of("token", token.toJwt()));
    }

    /**
     * LiveKit 웹훅 이벤트를 수신하는 엔드포인트.
     * LiveKit 서버에서 발생하는 다양한 이벤트(예: 참가자 입장/퇴장)를 처리합니다.
     * @param authHeader Authorization 헤더 (웹훅 유효성 검증에 사용)
     * @param body 웹훅 이벤트 본문
     * @return "ok" 문자열
     */
    @PostMapping(value = "/webhook", consumes = "application/webhook+json")
    public ResponseEntity<String> receiveWebhook(@RequestHeader("Authorization") String authHeader, @RequestBody String body) {
        WebhookReceiver webhookReceiver = new WebhookReceiver(LIVEKIT_API_KEY, LIVEKIT_API_SECRET);
        try {
            // 웹훅 이벤트 유효성 검증 및 파싱
            WebhookEvent event = webhookReceiver.receive(body, authHeader);
            System.out.println("LiveKit Webhook: " + event.toString());
            // TODO: 실제 애플리케이션 로직에 따라 웹훅 이벤트 처리 (예: DB 업데이트, 다른 서비스 호출 등)
        } catch (Exception e) {
            System.err.println("Error validating webhook event: " + e.getMessage());
        }
        return ResponseEntity.ok("ok");
    }

    /**
     * AI 서버로부터 입력을 받아 STOMP를 통해 클라이언트에 전파하는 엔드포인트.
     * 이 엔드포인트는 AI 서버에서 호출될 것으로 예상됩니다.
     * @param aiInput AI 서버로부터 받은 입력 데이터 (예: 텍스트, JSON 등)
     * @return "ok" 문자열
     */
    @PostMapping("/ai-input")
    public ResponseEntity<String> receiveAiInput(@RequestBody String aiInput) {
        System.out.println("Received AI input: " + aiInput);
        // /topic/ai-updates 경로로 AI 입력 데이터를 STOMP 클라이언트에게 전송
        messagingTemplate.convertAndSend("/topic/ai-updates", aiInput);
        return ResponseEntity.ok("ok");
    }
}