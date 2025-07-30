package com.e104.reciplay.live.controller;

import io.swagger.v3.oas.annotations.tags.Tag;
import livekit.LivekitModels;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "라이브 클래스용 컨트롤러", description = "라이브 클래스 관련 API 및 웹소켓 메시지를 처리합니다.")
@RestController
@Slf4j
@RequiredArgsConstructor
public class LiveController {
    private final SimpMessagingTemplate messagingTemplate;

    // 제공해야하는 기능 : 질문하기, 투두리스트 체크하기
    // 투두리스트 체크하기 => 강사 개인 토픽으로 전송하는 기능.
    // 강사가 제공하는 기능 : 손뼉으로 챕터 넘기기
    // 특정 유저가 구독하는 /queue 채널 : /queue/live/강사 ID
    // 강의 방의 토픽 채널 : /topic/live/렉처ID -> 체크리스트 체크 및 질문하기 기능을 제공.
    // 다음 챕터 요청 받아 처리하는 컨트롤러 매핑 : /app/next-chapter
    // 요청 받아 처리하는 컨트롤러 매핑

//    @MessageMapping("/next-chapter")
//    public void forwardNextChapter(@Payload )  {
//
//    }
}
