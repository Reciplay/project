package com.e104.reciplay.admin.controller;

import com.e104.reciplay.admin.dto.request.ApprovalInfo;
import com.e104.reciplay.admin.dto.response.*;
import com.e104.reciplay.admin.service.*;
import com.e104.reciplay.common.response.dto.ResponseRoot;
import com.e104.reciplay.common.response.util.CommonResponseBuilder;
import com.e104.reciplay.user.security.service.UserQueryService;
import com.e104.reciplay.user.security.util.AuthenticationUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "관리자 페이지 API", description = "관리자 페이지")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/course/admin")
@Slf4j

public class AdminApiController{

    private final AdInstructorQueryService adInstructorQueryService;
    private final AdInstructorManagementService adInstructorManagementService;
    private final AdCourseQueryService adCourseQueryService;
    private final AdUserQueryService adUserQueryService;
    private final AdUserManagementService adUserManagementService;
    private final AdCourseManagementService adCourseManagementService;
    private final UserQueryService userQueryService;
    
    @GetMapping("/instructor/summaries")
    @ApiResponse(responseCode = "200", description = "강사 요약 정보 리스트 조회 성공")
    @ApiResponse(responseCode = "400", description = "잘못된 형식의 데이터입니다. 요청 데이터를 확인해주세요.")
    @ApiResponse(responseCode = "403", description = "관리자가 아닌 사용자가 시도")
    @Operation(summary = "강사 요약 정보 리스트 조회 API", description = "강사 요약 정보 신청 리스트 조회")
    public ResponseEntity<ResponseRoot<List<AdInstructorSummary>>> getInstructorSummaries(
            @RequestParam Boolean isApprove
    ) {
        List<AdInstructorSummary> summaries = adInstructorQueryService.queryAdInstructorSummary(isApprove);
        return CommonResponseBuilder.success("강사 요약 정보 리스트 조회에 성공하였습니다.",
                summaries);
    }

    @GetMapping("/instructor")
    @ApiResponse(responseCode = "200", description = "강사 상세 정보 조회 성공")
    @ApiResponse(responseCode = "400", description = "잘못된 형식의 데이터입니다. 요청 데이터를 확인해주세요.")
    @ApiResponse(responseCode = "403", description = "관리자가 아닌 사용자가 시도")
    @ApiResponse(responseCode = "404", description = "조회할 강사를 찾을 수 없음")
    @Operation(summary = "강사 상세 정보 조회 API", description = "강사 상세 정보 조회")
    public ResponseEntity<ResponseRoot<AdInstructorDetail>> getInstructorDetail(
            @RequestParam Long instructorId
    ){
        AdInstructorDetail detail = adInstructorQueryService.queryInstructorDetail(instructorId);

        return CommonResponseBuilder.success("강사 상세 정보 조회에 성공하였습니다.", detail);
    }

    @PutMapping("/instructor")
    @ApiResponse(responseCode = "200", description = "강사 등록 수락/거절 및 알림 처리 성공")
    @ApiResponse(responseCode = "400", description = "잘못된 형식의 데이터입니다. 요청 데이터를 확인해주세요.")
    @ApiResponse(responseCode = "403", description = "관리자가 아닌 사용자가 시도")
    @ApiResponse(responseCode = "404", description = "처리할 강사를 찾을 수 없음")
    @Operation(summary = "강사 등록 수락/거절 및 알림 처리 API", description = "강사 등록 수락/거절 및 알림 처리 API")
    public ResponseEntity<ResponseRoot<Object>> handleIntructorRegistration(
            @RequestBody ApprovalInfo approvalInfo
    ){
        String email = AuthenticationUtil.getSessionUsername();
        Long adminUserId = userQueryService.queryUserByEmail(email).getId();
        adInstructorManagementService.updateInstructorApproval(approvalInfo, adminUserId);
        return CommonResponseBuilder.success("강사 등록 수락/거절 및 알림 처리에 성공하였습니다.", null);
    }

    @GetMapping("/course/summaries")
    @ApiResponse(responseCode = "200", description = "강좌 요약 정보 리스트 조회 성공")
    @ApiResponse(responseCode = "400", description = "잘못된 형식의 데이터입니다. 요청 데이터를 확인해주세요.")
    @ApiResponse(responseCode = "403", description = "관리자가 아닌 사용자가 시도")
    @Operation(summary = "강좌 요약 정보 리스트 조회 API", description = "강좌 요약 정보 신청 리스트 조회")
    public ResponseEntity<ResponseRoot<List<AdCourseSummary>>> getCourseSummaries(
            @RequestParam Boolean isApprove
    ) {
        List<AdCourseSummary> summaries = adCourseQueryService.queryAdCourseSummary(isApprove);
        return CommonResponseBuilder.success("강좌 요약 정보 리스트 조회에 성공하였습니다.",
                summaries);
    }

    @GetMapping("/course")
    @ApiResponse(responseCode = "200", description = "강좌 상세 정보 조회 성공")
    @ApiResponse(responseCode = "400", description = "잘못된 형식의 데이터입니다. 요청 데이터를 확인해주세요.")
    @ApiResponse(responseCode = "403", description = "관리자가 아닌 사용자가 시도")
    @ApiResponse(responseCode = "404", description = "조회할 강좌를 찾을 수 없음")
    @Operation(summary = "강좌 상세 정보 조회 API", description = "강좌 상세 정보 조회")
    public ResponseEntity<ResponseRoot<AdCourseDetail>> getCourseDetail(
            @RequestParam Long courseId
    ){

        AdCourseDetail detail = adCourseQueryService.queryCourseDetail(courseId);
        return CommonResponseBuilder.success("강좌 상세 정보 조회에 성공하였습니다.", detail);

    }

    @PutMapping("/course")
    @ApiResponse(responseCode = "200", description = "강좌 등록 수락/거절 및 알림 처리 성공")
    @ApiResponse(responseCode = "400", description = "잘못된 형식의 데이터입니다. 요청 데이터를 확인해주세요.")
    @ApiResponse(responseCode = "403", description = "관리자가 아닌 사용자가 시도")
    @ApiResponse(responseCode = "404", description = "처리할 강좌를 찾을 수 없음")
    @Operation(summary = "강좌 등록 수락/거절 및 알림 처리 API", description = "강좌 등록 수락/거절 및 알림 처리")
    public ResponseEntity<ResponseRoot<Object>> handleCourseRegistration(
            @RequestBody ApprovalInfo approvalInfo
    ){
        String email = AuthenticationUtil.getSessionUsername();
        Long adminUserId = userQueryService.queryUserByEmail(email).getId();
        adCourseManagementService.updateCourseApproval(approvalInfo, adminUserId);

        return CommonResponseBuilder.success("강좌 등록 수락/거절 및 알림 처리에 성공하였습니다.", null);
    }

    @GetMapping("/user/summaries")
    @ApiResponse(responseCode = "200", description = "일반 회원 요약 정보 리스트 조회 성공")
    @ApiResponse(responseCode = "400", description = "잘못된 형식의 데이터입니다. 요청 데이터를 확인해주세요.")
    @ApiResponse(responseCode = "403", description = "관리자가 아닌 사용자가 시도")
    @Operation(summary = "일반 회원 요약 정보 리스트 조회 API", description = "일반 회원 요약 정보 신청 리스트 조회")
    public ResponseEntity<ResponseRoot<List<AdUserSummary>>> getUserSummaries(
    ) {
        List<AdUserSummary> adUserSummaries = adUserQueryService.queryUserSummaries();
        return CommonResponseBuilder.success("일반 회원 요약 정보 리스트 조회에 성공하였습니다.",
                adUserSummaries);
    }

    @GetMapping("/user")
    @ApiResponse(responseCode = "200", description = "일반 회원 상세 정보 조회 성공")
    @ApiResponse(responseCode = "400", description = "잘못된 형식의 데이터입니다. 요청 데이터를 확인해주세요.")
    @ApiResponse(responseCode = "403", description = "관리자가 아닌 사용자가 시도")
    @ApiResponse(responseCode = "404", description = "조회할 회원을 찾을 수 없음")
    @Operation(summary = "일반 회원 상세 정보 조회 API", description = "일반 회원 상세 정보 조회")
    public ResponseEntity<ResponseRoot<AdUserDetail>> getUserDetail(
            @RequestParam Long userId
    ){
        AdUserDetail adUserDetail = adUserQueryService.queryUserDetail(userId);
        return CommonResponseBuilder.success("일반 회원 상세 정보 조회에 성공하였습니다.", adUserDetail);
    }

    @DeleteMapping("/user")
    @ApiResponse(responseCode = "200", description = "회원 탈퇴 성공")
    @ApiResponse(responseCode = "400", description = "잘못된 형식의 데이터입니다. 요청 데이터를 확인해주세요.")
    @ApiResponse(responseCode = "403", description = "관리자가 아닌 사용자가 시도")
    @ApiResponse(responseCode = "404", description = "조회할 회원을 찾을 수 없음")
    @Operation(summary = "회원 탈퇴 API", description = "회원 탈퇴")
    public ResponseEntity<ResponseRoot<Object>> DeleteUser(
            @RequestParam Long userId
    ){
        adUserManagementService.deleteUser(userId);
        return CommonResponseBuilder.success("회원 탈퇴에 성공하였습니다.", null);
    }
}