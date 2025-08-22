package com.e104.reciplay.user.instructor.controller;

import com.e104.reciplay.common.response.dto.ResponseRoot;
import com.e104.reciplay.common.response.util.CommonResponseBuilder;
import com.e104.reciplay.entity.Instructor;
import com.e104.reciplay.livekit.service.depends.InstructorQueryService;
import com.e104.reciplay.user.instructor.dto.request.InstructorApplicationRequest;
import com.e104.reciplay.user.instructor.dto.request.InstructorProfileUpdateRequest;
import com.e104.reciplay.user.instructor.dto.response.InstructorProfile;
import com.e104.reciplay.user.instructor.dto.response.InstructorStat;
import com.e104.reciplay.user.instructor.dto.response.TrendResponse;
import com.e104.reciplay.user.instructor.service.InstructorManagementService;
import com.e104.reciplay.user.security.service.UserQueryService;
import com.e104.reciplay.user.security.util.AuthenticationUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@Tag(name = "강사 관련 API", description = "강사에 대한 데이터를 조회하거나 강사 데이터 수정을 위한 API를 제공합니다.")
@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/api/v1/user/instructor")
public class InstructorApiController {

    private final UserQueryService userQueryService;
    private final InstructorManagementService instructorManagementService;
    private final InstructorQueryService instructorQueryService;

    @GetMapping("/profile")
    @Operation(summary = "강사 소개 조회 API", description = "강사 명, 프로필 이미지, 커버 이미지 등을 조회합니다.")
    @ApiResponse(responseCode = "200", description = "강사 소개 정보 조회에 성공함.")
    @ApiResponse(responseCode = "400", description = "없는 강사에 대한 조회 시도.")
    public ResponseEntity<ResponseRoot<InstructorProfile>> getInstructorProfile(
            @RequestParam("instructorId") Long instructorId
    ) {
        log.debug("강사 소개 조회 API 호출됨, 강사 ID = {}", instructorId);
        String email = AuthenticationUtil.getSessionUsername();
        log.debug("강사 소개 조회 API 호출됨, 세션 이메일 = {}", email);
        Long userId = userQueryService.queryUserByEmail(email).getId();
        log.debug("강사 소개 조회 API 호출됨, 유저 ID = {}", userId);
        InstructorProfile instructorProfile = instructorQueryService.queryInstructorProfile(instructorId, userId);
        log.debug("강사 소개 조회 API 응답 데이터 = {}", instructorProfile);
        return CommonResponseBuilder.success("강사 정보 조회에 성공했습니다.", instructorProfile);
    }

    @PutMapping("/profile")
    @Operation(summary = "강사 정보 수정 API", description = "강사가 자신의 정보를 수정합니다.")
    @ApiResponse(responseCode = "200", description = "강사 정보 수정 성공")
    @ApiResponse(responseCode = "403", description = "강사가 아닌 사용자가 시도")
    @ApiResponse(responseCode = "400", description = "강사 정보 오류")
    public ResponseEntity<ResponseRoot<Object>> updateInstructorProfile(
            @RequestPart("coverImage") MultipartFile instructorBannerImage,
            @RequestPart("profileInfo") InstructorProfileUpdateRequest request
            ) {
        String email = AuthenticationUtil.getSessionUsername();
        Long instructorId = instructorQueryService.queryInstructorIdByEmail(email);
        log.debug("강좌 정보 수정 시작");
        instructorManagementService.updateInstructor(instructorId, request, instructorBannerImage);

        return CommonResponseBuilder.success("강사 정보 수정에 성공했습니다.", null);
    }

    @PostMapping("")
    @Operation(summary = "강사 등록 API", description = "강사 등록을 수행한다. 관리자가 수락하기 전까진 is_approved 값이 false이다.")
    @ApiResponse(responseCode = "201", description = "강사 등록 신청에 성공함.")
    @ApiResponse(responseCode = "400", description = "이미 강사로 등록된 사용자가 시도")
    public ResponseEntity<ResponseRoot<Object>> applyForInstructorRole(
            @RequestPart("coverImage") MultipartFile instructorBannerImage,
            @RequestPart("instructorProfile") InstructorApplicationRequest request
    ) {
        log.debug("강사 등록 API 요청 데이터 {}", request);
        log.debug("요청자 {}", AuthenticationUtil.getSessionUsername());
        String email = AuthenticationUtil.getSessionUsername();
        Long userId = userQueryService.queryUserByEmail(email).getId();
        log.debug("강사 등록 시작");
        instructorManagementService.registerInstructor(userId, request, instructorBannerImage);

        return CommonResponseBuilder.success("강사 등록 신청에 성공했습니다.", null);
    }

    @GetMapping("/statistic")
    @Operation(summary = "강사  통계 정보 조회 API", description = "강사의  통계 정보를 조회합니다.")
    @ApiResponse(responseCode = "200", description = "강사 통계 정보 조회 성공")
    @ApiResponse(responseCode = "403", description = "강사가 아닌 사용자가 시도")
    public ResponseEntity<ResponseRoot<InstructorStat>> getInstructorStatistic(
    ) {
        log.debug("강사 통계 정보 조회 API 호출 중");
        String email = AuthenticationUtil.getSessionUsername();
        log.debug("통계 정보 조회 요청자 이메일 : {}", email);

        Long instructorId = instructorQueryService.queryInstructorIdByEmail(email);

        log.debug("통계 정보 조회 요청자의 강사 ID : {}", instructorId);

        InstructorStat instructorStat = instructorQueryService.queryInstructorStatistic(instructorId);
        return CommonResponseBuilder.success("강사 통계 정보 조회에 성공했습니다.", instructorStat);
    }

    @GetMapping("/subscriber")
    @Operation(summary = "강사 구독자 추이 조회", description = "강사의 통계합니다.")
    @ApiResponse(responseCode = "200", description = "강사 통계 정보 조회 성공")
    @ApiResponse(responseCode = "403", description = "강사가 아닌 사용자가 시도")
    public ResponseEntity<ResponseRoot<TrendResponse>> getInstructorSubscriberStat(
            @RequestParam("criteris") String criteria
    ) {
        log.debug("creiteris는 {}", criteria);
        String email = AuthenticationUtil.getSessionUsername();
        Instructor instructor = instructorQueryService.queryInstructorByEmail(email);
        if (!Boolean.TRUE.equals(instructor.getIsApproved())) {
            throw new RuntimeException("승인되지 않은 강사입니다.");
        }
        log.debug("구독자 추이 응답데이터 생성하는 매서드 실행");
        TrendResponse trendResponse = instructorQueryService.querySubscriberTrends(criteria, instructor.getId());

        return CommonResponseBuilder.success("강사 통계 정보 조회에 성공했습니다.",trendResponse);
    }


}



