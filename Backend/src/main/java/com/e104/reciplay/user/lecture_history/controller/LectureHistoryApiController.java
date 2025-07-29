package com.e104.reciplay.user.lecture_history.controller;

import com.e104.reciplay.common.response.dto.ResponseRoot;
import com.e104.reciplay.common.response.util.CommonResponseBuilder;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;


@Tag(name = "회원별 수강 이력 통계 및 관리 API", description = "수강 이력 조회 및 역량 조회")
@RestController
@RequestMapping("/api/v1/user/lecture-history")
@Slf4j
public class LectureHistoryApiController {

    @GetMapping("/progress")
    @Operation(summary = "사용", description = "사용자가 가입하려는 이메일이 이미 등록된 이메일인지 확인함.")
    @ApiResponse(responseCode = "200", description = "중복 없음. 또는 중복 있음.")
    public ResponseEntity<ResponseRoot<Double>> getProgressOfCourse(
            @RequestParam("courseId") Long courseId
    ) {

        return CommonResponseBuilder.success(courseId + "번 강좌 수강률 조회에 성공했습니다.",
                0d);
    }


}
