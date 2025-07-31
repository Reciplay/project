//package com.e104_2.reciplaywebsocket.controller;
//
//import io.swagger.v3.oas.annotations.Operation;
//import io.swagger.v3.oas.annotations.Parameter;
//import io.swagger.v3.oas.annotations.media.Content;
//import io.swagger.v3.oas.annotations.media.Schema;
//import io.swagger.v3.oas.annotations.responses.ApiResponse;
//import io.swagger.v3.oas.annotations.tags.Tag;
//import jakarta.validation.Valid;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.PostMapping;
//import org.springframework.web.bind.annotation.RequestBody;
//import org.springframework.web.bind.annotation.RequestMapping;
//import org.springframework.web.bind.annotation.RestController;
//
//import java.util.Map;
//
//@Tag(
//        name = "LiveKit 강사 제어 API",
//        description = "LiveKit 강의를 운영하는 강사를 위한 토큰 생성 및 제어 기능 API입니다. 참가자 강제 퇴장, 음소거, 발행 중지 기능을 제공합니다."
//)
//@RestController
//@RequestMapping("/live/v1/livekit")
//public class LivekitController {
//
//    private final LivekitServiceImpl livekitService;
//    private final SimpMessagingTemplate messagingTemplate;
//    private final LivekitInstructorControlService adminService;
//
//    public LivekitController(LivekitServiceImpl livekitService, SimpMessagingTemplate messagingTemplate, LivekitInstructorControlService adminService) {
//        this.livekitService = livekitService;
//        this.messagingTemplate = messagingTemplate;
//        this.adminService = adminService;
//    }
//
//    @Operation(
//            summary = "LiveKit 토큰 생성",
//            description = "강의 참여용 LiveKit JWT 토큰을 생성합니다. 강사/수강생 역할에 따라 권한이 다릅니다."
//    )
//    @ApiResponse(responseCode = "200", description = "토큰 생성 성공",
//            content = @Content(schema = @Schema(example = "{\"token\": \"eyJ...\"}")))
//    @ApiResponse(responseCode = "400", description = "파라미터 오류 또는 강의 미신청")
//    @PostMapping("/token")
//    public ResponseEntity<Map<String, String>> createToken(
//            @RequestBody @Valid @Parameter(description = "토큰 생성 요청 파라미터", required = true)
//            TokenRequest request) {
//
//        String token;
//        try {
//            if ("instructor".equalsIgnoreCase(request.getRole())) {
//                token = livekitService.createInstructorToken(request.getRoomName(), request.getUserId(), request.getParticipantName());
//            } else if ("student".equalsIgnoreCase(request.getRole())) {
//                token = livekitService.createStudentToken(request.getRoomName(), request.getUserId(), request.getParticipantName());
//            } else {
//                return ResponseEntity.badRequest().body(Map.of("errorMessage", "Invalid role value: must be 'instructor' or 'student'"));
//            }
//        } catch (IllegalArgumentException e) {
//            return ResponseEntity.badRequest().body(Map.of("errorMessage", e.getMessage()));
//        }
//
//        return ResponseEntity.ok(Map.of("token", token));
//    }
//
//    @Operation(
//            summary = "참가자 강제 퇴장",
//            description = "강사가 강의 중 특정 참가자를 강제로 퇴장시킵니다."
//    )
//    @ApiResponse(responseCode = "200", description = "성공적으로 강제 퇴장됨")
//    @ApiResponse(responseCode = "400", description = "잘못된 요청 파라미터")
//    @PostMapping("/disconnect")
//    public ResponseEntity<?> disconnectParticipant(
//            @RequestBody @Valid @Parameter(
//                    description = "강제 퇴장 요청 정보", required = true,
//                    schema = @Schema(implementation = DisconnectParticipantRequest.class)
//            ) DisconnectParticipantRequest request) {
//        adminService.disconnectParticipant(request.getRoomName(), request.getIdentity());
//        return ResponseEntity.ok().build();
//    }
//
//    @Operation(
//            summary = "참가자 트랙 음소거",
//            description = "강사가 특정 참가자의 오디오 또는 비디오 트랙을 음소거합니다."
//    )
//    @ApiResponse(responseCode = "200", description = "음소거 처리 완료")
//    @ApiResponse(responseCode = "400", description = "요청 파라미터 오류")
//    @PostMapping("/mute")
//    public ResponseEntity<?> muteTracks(
//            @RequestBody @Parameter(description = "음소거 요청 정보", required = true)
//            MuteTrackRequest request) {
//        adminService.muteTracks(request.getRoomName(), request.getIdentity(), request.getTracks());
//        return ResponseEntity.ok().build();
//    }
//
//    @Operation(
//            summary = "참가자 트랙 발행 중지",
//            description = "강사가 참가자의 비디오/오디오 트랙 발행을 중지합니다."
//    )
//    @ApiResponse(responseCode = "200", description = "발행 중지 처리 완료")
//    @ApiResponse(responseCode = "400", description = "잘못된 요청")
//    @PostMapping("/unpublish")
//    public ResponseEntity<?> unpublishTracks(
//            @RequestBody @Parameter(description = "발행 중지 요청 정보", required = true)
//            UnpublishTrackRequest request) {
//        adminService.unpublishTracks(request.getRoomName(), request.getIdentity(), request.getTracks());
//        return ResponseEntity.ok().build();
//    }
//
//    @Operation(summary = "LiveKit 웹훅 수신", description = "LiveKit 서버로부터 웹훅 이벤트를 수신하고 처리합니다.")
//    @PostMapping(value = "/webhook", consumes = "application/webhook+json")
//    public ResponseEntity<String> receiveWebhook(
//            @RequestHeader("Authorization") String authHeader,
//            @RequestBody String body) {
//        livekitService.handleWebhook(authHeader, body);
//        return ResponseEntity.ok("ok");
//    }
//
//    @Operation(summary = "AI 입력 수신 및 STOMP 전파", description = "AI 서버로부터 받은 데이터를 STOMP를 통해 클라이언트에 전파합니다.")
//    @PostMapping("/ai-input")
//    public ResponseEntity<String> receiveAiInput(@RequestBody String aiInput) {
//        System.out.println("Received AI input: " + aiInput);
//        messagingTemplate.convertAndSend("/topic/ai-updates", aiInput);
//        return ResponseEntity.ok("ok");
//    }
//}
