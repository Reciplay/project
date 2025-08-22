package com.e104.reciplay.user.subscription.controller;

import com.e104.reciplay.common.response.dto.ResponseRoot;
import com.e104.reciplay.common.response.util.CommonResponseBuilder;
import com.e104.reciplay.livekit.service.depends.InstructorQueryService;
import com.e104.reciplay.user.security.dto.CustomUserDetails;
import com.e104.reciplay.user.security.service.UserQueryService;
import com.e104.reciplay.user.security.util.AuthenticationUtil;
import com.e104.reciplay.user.subscription.dto.SubscribedInstructorItem;
import com.e104.reciplay.user.subscription.service.SubscriptionManagementService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "강사 구독 관리 API", description = "강사를 구독하고 취소하는 기능을 제공함.")
@RestController
@Slf4j
@RequiredArgsConstructor
@RequestMapping("/api/v1/user/subscription")
public class SubscriptionApiController {
    private final SubscriptionManagementService subscriptionManagementService;
    private final UserQueryService userQueryService;
    private final InstructorQueryService instructorQueryService;

    @PostMapping("")
    @Operation(summary = "강사 구독 API", description = "로그인한 사용자가 특정 강사를 구독합니다.")
    @ApiResponse(responseCode = "201", description = "강사 구독 성공")
    @ApiResponse(responseCode = "403", description = "구독한 강사를 구독")
    public ResponseEntity<ResponseRoot<Object>> subscribeInstructor(
            @RequestParam("instructorId") Long instructorId,
            @AuthenticationPrincipal CustomUserDetails userDetails
            ) {
        log.debug("강사 구독 API 요청 데이터 = {}", instructorId);
        log.debug("강사 구독 API 요청 사용자 = {}", userDetails);

        subscriptionManagementService.subscribeInstructor(instructorId, userDetails.getUsername());
        return CommonResponseBuilder.success("강사 구독에 성공했습니다.", null);
    }

    @DeleteMapping("")
    @Operation(summary = "강사 구독 취소 API", description = "로그인한 사용자가 특정 강사 구독을 취소합니다.")
    @ApiResponse(responseCode = "200", description = "강사 구독 취소 성공")
    @ApiResponse(responseCode = "403", description = "구독한 적 없는 강사를 구독 취소")
    public ResponseEntity<ResponseRoot<Object>> unsubscribeInstructor(
            @RequestParam("instructorId") Long instructorId,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        log.debug("강사 구독 취소 API 요청 데이터 = {}", instructorId);
        log.debug("강사 구독 취소 API 요청 사용자 = {}", userDetails);

        subscriptionManagementService.cancleSubscription(instructorId, userDetails.getUsername());
        return CommonResponseBuilder.success("강사 구독 취소에 성공했습니다.", null);
    }

    @GetMapping("list")
    @Operation(summary = "유저가 구독한 강사 리스트 조회 API", description = "유저가 구독한 강사 리스트 조회")
    @ApiResponse(responseCode = "200", description = "구독한 강사 리스트 조회 성공")
    @ApiResponse(responseCode = "400", description = "잘못된 형식의 데이터입니다. 요청 데이터를 확인해주세요.")
    public ResponseEntity<ResponseRoot<List<SubscribedInstructorItem>>> getSubscriptions(){
        String email = AuthenticationUtil.getSessionUsername();
        log.debug("요청 사용자 이메일 {}", email);

        Long userId = userQueryService.queryUserByEmail(email).getId();
        log.debug("요청 사용자 userId {}", userId);
        List<SubscribedInstructorItem> subsciptionInfos = instructorQueryService.queryUserSubscriptionsByUserId(userId);
        return CommonResponseBuilder.success("해당 유저가 구독한 강사 리스트 조회에 성공했습니다.", subsciptionInfos);
    }
}
