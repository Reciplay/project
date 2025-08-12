package com.e104.reciplay.livekit.controller;

import com.e104.reciplay.common.response.dto.ResponseRoot;
import com.e104.reciplay.common.response.util.CommonResponseBuilder;
import com.e104.reciplay.livekit.dto.request.CloseLiveRequest;
import com.e104.reciplay.livekit.dto.request.LiveEstablishRequest;
import com.e104.reciplay.livekit.dto.response.LivekitTokenResponse;
import com.e104.reciplay.livekit.exception.CanNotOpenLiveRoomException;
import com.e104.reciplay.livekit.exception.CanNotParticipateInLiveRoomException;
import com.e104.reciplay.livekit.service.LivekitOpenService;
import com.e104.reciplay.user.security.dto.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/v1/livekit")
@RequiredArgsConstructor
@Slf4j
public class LivekitController {

    private final LivekitOpenService livekitOpenService;
    private final SimpMessagingTemplate messagingTemplate;

    @PostMapping("/instructor/token") // 강사에게만 허용된다.
    public ResponseEntity<ResponseRoot<LivekitTokenResponse>> createInstructorToken(@RequestBody LiveEstablishRequest request) {
        Long courseId = request.getCourseId();
        Long lectureId = request.getLectureId();

        if (courseId == null || lectureId == null) {
            throw new CanNotOpenLiveRoomException("요청에 강좌 또는 강의 ID가 없습니다.");
        }

        LivekitTokenResponse response = livekitOpenService.createInstructorToken(lectureId, courseId);
        return CommonResponseBuilder.create("라이브 강좌가 개설되었습니다.", response);
    }

    @PostMapping("/student/token")
    public ResponseEntity<ResponseRoot<LivekitTokenResponse>> createStudentToken(@RequestBody LiveEstablishRequest request) {
        Long courseId = request.getCourseId();
        Long lectureId = request.getLectureId();

        if (courseId == null || lectureId == null) {
            throw new CanNotParticipateInLiveRoomException("요청에 강좌 또는 강의 ID가 없습니다.");
        }

        LivekitTokenResponse response = livekitOpenService.createStudentToken(lectureId, courseId);
        return CommonResponseBuilder.create("라이브 강좌에 참여했습니다.", response);
    }

    @DeleteMapping("/lecture")
    public ResponseEntity<ResponseRoot<Object>> closeLiveRoom(
            @ModelAttribute CloseLiveRequest request,
            @AuthenticationPrincipal CustomUserDetails userDetails
            ) {
        log.debug("라이브 강의 종료 API 호출, 데이터 {}", request);
        log.debug("라이브 강의 종료 API 호출, 사용자 {}", userDetails);

        return CommonResponseBuilder.success("라이브 종료에 성공했습니다.", null);
    }
}