package com.e104_2.reciplaywebsocket.room.controller;

import com.e104_2.reciplaywebsocket.room.dto.EventMessage;
import com.e104_2.reciplaywebsocket.room.service.LiveControlService;
import jdk.jfr.Event;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import java.net.URL;

@RestController
@Slf4j
@RequiredArgsConstructor
public class LiveController {
    private final SimpMessagingTemplate messagingTemplate;
    @Value("${application.url-prefix}")
    private String URL_PREFIX;

    private final LiveControlService liveControlService;

    @MessageMapping("/join")
    public void joinEvent(@Payload EventMessage message) {
        String roomId = message.getLectureName() + message.getLectureId();
        System.out.println(message);

//        if(liveControlService.checkParticipationHistory(message.getSender(), message.getLectureId())) {
//            return;
//        }
        // 강제 퇴장이나 블랙리스트 검사하여 쫓아내기.


        messagingTemplate.convertAndSend(URL_PREFIX + "/topic/room/" + roomId, message);
    }

    @MessageMapping("/re-join")
    public void joinEventAnswer(@Payload EventMessage message) {
        String roomId = message.getLectureName() + message.getLectureId();
        System.out.println(message);
        messagingTemplate.convertAndSend(URL_PREFIX + "/topic/room/" + roomId, message);
    }

    @MessageMapping("/quit")
    public void quitEvent(@Payload EventMessage message) {
        String roomId = message.getLectureName() + message.getLectureId();

        if(liveControlService.checkParticipationHistory(message.getSender(), message.getLectureId())) {
            return;
        } else {
            // 존재하는 라이브 참여 이력에서 제거한다.
            // 라이브에 재입장을 어떻게 막을 것인가? -> Quit 리스트를 사용. + 강제 퇴장 테이블 사용.

        }
        System.out.println(message);
        messagingTemplate.convertAndSend(URL_PREFIX + "/topic/room/" + roomId, message);
    }

    /*
        registry.enableSimpleBroker("/topic", "/queue");
        ///queue는 반드시 INSTRUCTOR ROLE만 허용할 것.
        registry.setApplicationDestinationPrefixes("/app");
        registry.setUserDestinationPrefix("/instructor");
     */

    @MessageMapping("/todo-item")
    public void finishTodo() {

    }

}
