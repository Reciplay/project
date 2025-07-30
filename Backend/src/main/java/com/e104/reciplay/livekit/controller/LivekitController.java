package com.e104.reciplay.livekit.controller;

import com.e104.reciplay.livekit.service.LivekitService;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/livekit")
public class LivekitController {

    private final LivekitService livekitService;
    private final SimpMessagingTemplate messagingTemplate;

    public LivekitController(LivekitService livekitService, SimpMessagingTemplate messagingTemplate) {
        this.livekitService = livekitService;
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

        String token = livekitService.createToken(roomName, participantName);
        return ResponseEntity.ok(Map.of("token", token));
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
        System.out.println("WEBHOOK @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
        livekitService.handleWebhook(authHeader, body);
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