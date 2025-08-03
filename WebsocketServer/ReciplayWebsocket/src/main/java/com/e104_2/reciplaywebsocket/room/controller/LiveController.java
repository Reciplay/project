package com.e104_2.reciplaywebsocket.room.controller;

import com.e104_2.reciplaywebsocket.common.response.dto.ResponseRoot;
import com.e104_2.reciplaywebsocket.common.response.util.CommonResponseBuilder;
import com.e104_2.reciplaywebsocket.room.dto.EventMessage;
import com.e104_2.reciplaywebsocket.room.service.LiveControlService;
import com.e104_2.reciplaywebsocket.security.dto.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;

@RestController
@Slf4j
@RequiredArgsConstructor
@RequestMapping("/api/v1/live")
public class LiveController {
    private final SimpMessagingTemplate messagingTemplate;

    @Value("${application.url-prefix}")
    private String URL_PREFIX;

    private final LiveControlService liveControlService;



    @MessageMapping("/join") // 참여자가 만약, 강제퇴장 리스트에 있다면, 다시 퇴장 시켜야 함.
    public void joinEvent(@Payload EventMessage message) {
        // 어떤 사용자가 이미 존재하여야 함 -> 참가용 토큰 발급을 한 뒤에 수행되기 때문이다.
        String roomId = message.getLectureName() + message.getLectureId();
        System.out.println(message);

        // 강제 퇴장이나 블랙리스트, 강의 참여 여부 검사하여 쫓아내기.
        if(!liveControlService.checkParticipationPrivilege(message.getSender(), message.getLectureId())) {
            return;
        }
        // 아니라면, 참여 메시지 브로드캐스팅.
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

        if(!liveControlService.checkParticipationPrivilege(message.getSender(), message.getLectureId())) {
            return;
        } else {
            // 존재하는 라이브 참여 이력에서 제거한다.
            liveControlService.quitFromLiveRoom(message.getSender(), message.getLectureId());
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

    /////////////////////////////////////
    //   라이브 제어용 API
    /////////////////////////////////////


    // 강사만 접근 가능.
    @GetMapping("/remove")
    public ResponseEntity<ResponseRoot<Object>> removeParticipant(
            @RequestParam("lectureId") Long lectureId,
            @RequestParam("targetEmail") String targetEmail,
            @AuthenticationPrincipal CustomUserDetails user
    ) throws IOException
    {
        String userEmail = user.getUsername();
        liveControlService.removeParticipant(lectureId, targetEmail, userEmail);
        return CommonResponseBuilder.success("퇴장 처리에 성공했습니다.", null);
    }

    // 강제 음소거
    @GetMapping("/mute")
    public ResponseEntity<ResponseRoot<Object>> muteParticipant(
            @RequestParam("lectureId") Long lectureId,
            @RequestParam("targetEmail") String targetEmail,
            @AuthenticationPrincipal CustomUserDetails user
    ) {
        String userEmail = user.getUsername();


        return CommonResponseBuilder.success("음소거에 성공했습니다.", null);
    }

}
