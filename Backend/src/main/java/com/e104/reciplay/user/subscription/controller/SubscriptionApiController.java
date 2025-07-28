package com.e104.reciplay.user.subscription.controller;

import com.e104.reciplay.common.response.dto.ResponseRoot;
import com.e104.reciplay.common.response.util.CommonResponseBuilder;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Tag(name = "강사 구독 관리 API", description = "강사를 구독하고 취소하는 기능을 제공함.")
@RestController
@RequestMapping("/api/v1/user/subscription")
public class SubscriptionApiController {

    @PostMapping("")
    @Operation(summary = "강사 구독 API", description = "로그인한 사용자가 특정 강사를 구독합니다.")
    @ApiResponse(responseCode = "201", description = "강사 구독 성공")
    @ApiResponse(responseCode = "403", description = "구독한 강사를 구독")
    public ResponseEntity<ResponseRoot<Object>> subscribeInstructor(
            @RequestParam("instructorId") Long instructorId
    ) {

        return CommonResponseBuilder.success("강사 구독에 성공했습니다.", null);
    }

    @DeleteMapping("")
    @Operation(summary = "강사 구독 취소 API", description = "로그인한 사용자가 특정 강사 구독을 취소합니다.")
    @ApiResponse(responseCode = "200", description = "강사 구독 취소 성공")
    @ApiResponse(responseCode = "403", description = "구독한 적 없는 강사를 구독 취소")
    public ResponseEntity<ResponseRoot<Object>> unsubscribeInstructor(
            @RequestParam("instructorId") Long instructorId
    ) {

        return CommonResponseBuilder.success("강사 구독 취소에 성공했습니다.", null);
    }
}
