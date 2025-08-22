package com.e104.reciplay.user.lecture_history.controller;

import com.e104.reciplay.common.response.dto.ResponseRoot;
import com.e104.reciplay.common.response.util.CommonResponseBuilder;
import com.e104.reciplay.user.lecture_history.service.PersonalStatService;
import com.e104.reciplay.user.security.dto.CustomUserDetails;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;


@Tag(name = "회원별 수강 이력 통계 및 관리 API", description = "수강 이력 조회 및 역량 조회")
@RestController
@RequestMapping("/api/v1/user/lecture-history")
@RequiredArgsConstructor
@Slf4j
public class LectureHistoryApiController {
    private final PersonalStatService personalStatService;

    @GetMapping("/progree")
    @Operation(summary = "사용", description = "특정 강좌에 대한 진행률을 조회함.")
    @ApiResponse(responseCode = "200", description = "중복 없음. 또는 중복 있음.")
    public ResponseEntity<ResponseRoot<Double>> getProgressOfCourse(
            @RequestParam("courseId") Long courseId,
            @AuthenticationPrincipal CustomUserDetails userDetails
            ) {
        log.debug("수강률 조회 대상 강좌 = {}", courseId);
        log.debug("수강률 조회 요청 사용자 = {}", userDetails);

        return CommonResponseBuilder.success(courseId + "번 강좌 수강률 조회에 성공했습니다.",
                personalStatService.calcCourseProgress(courseId, userDetails.getUsername()));
    }
}
