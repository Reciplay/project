package com.e104.reciplay.livekit.controller;

import com.e104.reciplay.common.response.dto.ResponseRoot;
import com.e104.reciplay.common.response.util.CommonResponseBuilder;
import com.e104.reciplay.livekit.dto.request.LiveEstablishRequest;
import com.e104.reciplay.livekit.dto.response.LivekitTokenResponse;
import com.e104.reciplay.livekit.exception.CanNotOpenLiveRoomException;
import com.e104.reciplay.livekit.exception.CanNotParticipateInLiveRoomException;
import com.e104.reciplay.livekit.service.LivekitControlService;
import com.e104.reciplay.livekit.service.LivekitOpenService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/v1/livekit")
@RequiredArgsConstructor
public class LivekitController {

    private final LivekitOpenService livekitOpenService;
    private final SimpMessagingTemplate messagingTemplate;
    private final LivekitControlService livekitControlService;

    @PostMapping("/instructor/token") // 강사에게만 허용된다.
    public ResponseEntity<ResponseRoot<LivekitTokenResponse>> createInstructorToken(@RequestBody LiveEstablishRequest request) {
        Long courseId = request.getCourseId();
        Long lectureId = request.getLectureId();

        if (courseId == null || lectureId == null) {
            throw new CanNotOpenLiveRoomException("요청에 강좌 또는 강의 ID가 없습니다.");
        }

        String token = livekitOpenService.createInstructorToken(lectureId, courseId);
        return CommonResponseBuilder.create("라이브 강좌가 개설되었습니다.", new LivekitTokenResponse(token));
    }

    @PostMapping("/student/token")
    public ResponseEntity<ResponseRoot<LivekitTokenResponse>> createStudentToken(@RequestBody LiveEstablishRequest request) {
        Long courseId = request.getCourseId();
        Long lectureId = request.getLectureId();

        if (courseId == null || lectureId == null) {
            throw new CanNotParticipateInLiveRoomException("요청에 강좌 또는 강의 ID가 없습니다.");
        }

        String token = livekitOpenService.createStudentToken(lectureId, courseId);
        return CommonResponseBuilder.create("라이브 강좌에 참여했습니다.", new LivekitTokenResponse(token));
    }

    @GetMapping("/disconnect")
    public ResponseEntity<ResponseRoot<Object>> disconnectParticipant(
            @RequestParam("lectureId") Long lectureId,
            @RequestParam("targetEmail") String targetEmail
    ) {
        // room name과 user email이  필요하다.
        // room name = lecture명 + lecture ID
        livekitControlService.disconnectStudent(lectureId, targetEmail);

        return CommonResponseBuilder.success("강제 퇴장에 성공했습니다.", null);
    }

}