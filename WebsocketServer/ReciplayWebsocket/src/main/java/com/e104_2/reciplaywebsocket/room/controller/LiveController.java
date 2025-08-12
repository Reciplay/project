package com.e104_2.reciplaywebsocket.room.controller;

import com.e104_2.reciplaywebsocket.common.response.dto.ResponseRoot;
import com.e104_2.reciplaywebsocket.common.response.util.CommonResponseBuilder;
import com.e104_2.reciplaywebsocket.entity.Todo;
import com.e104_2.reciplaywebsocket.room.dto.request.ChapterIssueRequest;
import com.e104_2.reciplaywebsocket.room.dto.request.EventMessage;
import com.e104_2.reciplaywebsocket.room.dto.request.TodoMessage;
import com.e104_2.reciplaywebsocket.room.dto.request.LiveControlRequest;
import com.e104_2.reciplaywebsocket.room.dto.response.ChapterTodoResponse;
import com.e104_2.reciplaywebsocket.room.dto.response.item.TodoSummary;
import com.e104_2.reciplaywebsocket.room.service.LiveControlService;
import com.e104_2.reciplaywebsocket.room.service.TodoQueryService;
import com.e104_2.reciplaywebsocket.security.dto.CustomUserDetails;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ReactiveAdapterRegistry;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.security.Principal;
import java.util.List;
import java.util.Map;

/*
    룸 참여 토큰 밠행시 룸 아이디도 함께 제공함.
    강의 구독 채널 : /ws/v1/topic/room/룸 아이디
    개인 구독 채널 : /ws/v1/queue/룸 아이디
*/

@Tag(name = "라이브 관리 API", description = "웹소켓 처리와 병행합니다. 강제퇴장, 음소거, 화면 송출 관련은 REST API로 처리합니다.")
@RestController
@Slf4j
@RequiredArgsConstructor
@RequestMapping("/api/v1/live")
public class LiveController {
    private final SimpMessagingTemplate messagingTemplate;

    @Value("${application.url-prefix}")
    private String URL_PREFIX;

    private final LiveControlService liveControlService;
    private final TodoQueryService todoQueryService;

    /*
            private String type;
            private String issuer;
            private String receiver;
            private String nickname;
            private Long lectureId;
            private String roomId;
            private List<String> state;
     */
    @MessageMapping("/help")
    public void helpMeEvent(@Payload EventMessage message) {
        if(message.getType().equals("help")) return;
        messagingTemplate.convertAndSendToUser(liveControlService.getLiveInstructorIdentity(message.getLectureId()),
                "/queue/"+message.getRoomId(),
                message);
    }

    @MessageMapping("/join") // 참여자가 만약, 강제퇴장 리스트에 있다면, 다시 퇴장 시켜야 함.
    public void joinEvent(@Payload EventMessage message) {
        // 어떤 사용자가 이미 존재함 -> 참가용 토큰 발급을 한 뒤에 수행되기 때문이다.
        System.out.println(message);
        if(!message.getType().equals("join")) return;

        LiveControlRequest controlRequest = new LiveControlRequest(message.getRoomId(), message.getIssuer(), message.getLectureId());
        // 강제 퇴장이나 블랙리스트, 강의 참여 여부 검사하여 쫓아내기.
        if(!liveControlService.checkParticipationPrivilege(message.getIssuer(), controlRequest)) {
            return;
        }
        // 아니라면, 참여 메시지 브로드캐스팅.
        messagingTemplate.convertAndSend(URL_PREFIX + "/topic/room/" + message.getRoomId(), message);
    }

    @MessageMapping("/re-join")
    public void joinEventAnswer(@Payload EventMessage message) {
        if(!message.getType().equals("re-join")) return;
        messagingTemplate.convertAndSendToUser(message.getReceiver(), URL_PREFIX + "/queue/room/" + message.getRoomId(), message);
    }

    @MessageMapping("/quit")
    public void quitEvent(@Payload EventMessage message) {
        LiveControlRequest controlRequest = new LiveControlRequest(message.getRoomId(), message.getIssuer(), message.getLectureId());
        if(!message.getType().equals("quit")) return;
        // 강제 퇴장이나 블랙리스트, 강의 참여 여부 검사하여 쫓아내기.
        if(!liveControlService.checkParticipationPrivilege(message.getIssuer(), controlRequest)) {
            return;
        } else {
            // 존재하는 라이브 참여 이력에서 제거한다.
            liveControlService.quitFromLiveRoom(message.getIssuer(), message.getLectureId());
        }
        System.out.println(message);
        messagingTemplate.convertAndSend(URL_PREFIX + "/topic/room/" + message.getRoomId(), message);
    }

    /*
        registry.enableSimpleBroker("/topic", "/queue");
        ///queue는 반드시 INSTRUCTOR ROLE만 허용할 것.
        registry.setApplicationDestinationPrefixes("/app");
        registry.setUserDestinationPrefix("/instructor");
     */

    @MessageMapping("/todo-check")
    public void finishTodo(@Payload TodoMessage message) { // 특정 사용자아 어느 챕터 어느 todo를 체크했는지 넘긴다.
        if(!message.getType().equals("todo-check")) return;
        System.out.println(message);
        // 클라이언트측(강사)는 subscribe("/user/queue/룸 ID") 로 구독한다.
        // 회원은 send("/app/todo-check")로 전송한다.
        // 핸들러가 convertAndSendToUser(강사이메일, "/queue/룸 ID")로 전송한다.
        messagingTemplate.convertAndSendToUser(liveControlService.getLiveInstructorIdentity(message.getLectureId()),
                "/queue/"+message.getRoomId(),
                message);
    }

    @MessageMapping("/chapter-issue")
    public void issueNextChapter(@Payload ChapterIssueRequest message,
                                 Principal principal,
                                 @AuthenticationPrincipal CustomUserDetails userDetail
    ) {
        if(!message.getType().equals("chapter-issue")) return;
        Integer sequence = message.getChapterSequence();
        Long lectureId = message.getLectureId();

        UsernamePasswordAuthenticationToken token = (UsernamePasswordAuthenticationToken)principal;
        CustomUserDetails userDetails = (CustomUserDetails)token.getPrincipal();

        if(!principal.getName().equals(message.getIssuer()) || !userDetails.getAuthorities().iterator().next().getAuthority().equals("ROLE_INSTRUCTOR")) {
            messagingTemplate.convertAndSendToUser(message.getIssuer(), URL_PREFIX+"/queue/"+message.getRoomId(), Map.of("status", "refused", "message", "라이브룸 강사 권한이 없습니다."));
            return;
        }
        ChapterTodoResponse response = null;
        try {
            response = todoQueryService.queryTodoOfChapter(lectureId, sequence);
        } catch(Exception e) {
            response = new ChapterTodoResponse("chapter-issue", 1L, "챕터 이름", 1, 2,
                    List.of(new TodoSummary("투두 1", "TIMER", 100, 1),
                            new TodoSummary("투두 2", "NORMAL", 0, 2)));
        }

        messagingTemplate.convertAndSend(URL_PREFIX+"/topic/room/"+message.getRoomId(), response);
    }


    /////////////////////////////////////
    //   라이브 제어용 API
    /////////////////////////////////////


    // 강사만 접근 가능.
    @GetMapping("/remove")
    public ResponseEntity<ResponseRoot<Object>> removeParticipant(
            @ModelAttribute LiveControlRequest request,
            @AuthenticationPrincipal CustomUserDetails user
    ) throws IOException
    {

        String userEmail = user.getUsername();
        liveControlService.removeParticipant(request, userEmail);
        Map<String, String> result = Map.of("message", request.getTargetEmail()+"님께서 강제퇴장 되셨습니다.");
        messagingTemplate.convertAndSend(URL_PREFIX+"/topic/room/"+request.getRoomId(), result);
        return CommonResponseBuilder.success("퇴장 처리에 성공했습니다.", null);
    }

    // 강제 음소거
    @GetMapping("/mute-audio")
    public ResponseEntity<ResponseRoot<Object>> muteAudio(
            @ModelAttribute LiveControlRequest request,
            @AuthenticationPrincipal CustomUserDetails user
    ) throws IOException {
        String userEmail = user.getUsername();

        liveControlService.muteAudio(request, userEmail);
        Map<String, String> result = Map.of("message", request.getTargetEmail()+"님께서 음소거 되셨습니다.");
        messagingTemplate.convertAndSend(URL_PREFIX+"/topic/room/"+request.getRoomId(), result);
        return CommonResponseBuilder.success("음소거에 성공했습니다.", null);
    }

    @GetMapping("/unmute-audio")
    public ResponseEntity<ResponseRoot<Object>> unmuteAudio(
            @ModelAttribute LiveControlRequest request,
            @AuthenticationPrincipal CustomUserDetails user
    ) throws IOException {
        String userEmail = user.getUsername();

        liveControlService.unmuteAudio(request, userEmail);
        Map<String, String> result = Map.of("message", request.getTargetEmail()+"님께서 음소거 해제 되셨습니다.");
        messagingTemplate.convertAndSend(URL_PREFIX+"/topic/room/"+request.getRoomId(), result);
        return CommonResponseBuilder.success("음소거에 성공했습니다.", null);
    }


    @GetMapping("/mute-video")
    public ResponseEntity<ResponseRoot<Object>> muteVideo(
            @ModelAttribute LiveControlRequest request,
            @AuthenticationPrincipal CustomUserDetails user
    ) throws IOException {
        String userEmail = user.getUsername();

        liveControlService.muteVideo(request, userEmail);
        Map<String, String> result = Map.of("message", request.getTargetEmail()+"님께서 비디오 차단 되셨습니다.");
        messagingTemplate.convertAndSend(URL_PREFIX+"/topic/room/"+request.getRoomId(), result);
        return CommonResponseBuilder.success("비디오 차단에 성공했습니다.", null);
    }

    @GetMapping("/unmute-video")
    public ResponseEntity<ResponseRoot<Object>> unmuteVideo(
            @ModelAttribute LiveControlRequest request,
            @AuthenticationPrincipal CustomUserDetails user
    ) throws IOException {
        String userEmail = user.getUsername();

        liveControlService.unmuteVideo(request, userEmail);
        Map<String, String> result = Map.of("message", request.getTargetEmail()+"님께서 비디오 송출 되셨습니다.");
        messagingTemplate.convertAndSend(URL_PREFIX+"/topic/room/"+request.getRoomId(), result);
        return CommonResponseBuilder.success("비디오 송출에 성공했습니다.", null);
    }
}
