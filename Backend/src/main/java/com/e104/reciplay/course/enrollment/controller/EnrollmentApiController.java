package com.e104.reciplay.course.enrollment.controller;

import com.e104.reciplay.common.response.dto.ResponseRoot;
import com.e104.reciplay.common.response.util.CommonResponseBuilder;
import com.e104.reciplay.course.enrollment.service.EnrollmentManagementService;
import com.e104.reciplay.user.security.dto.CustomUserDetails;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@Tag(name = "수강 신청 관리 API", description = "수강 신청 관리")
@RestController
@RequestMapping("/api/v1/course/enrollment")
@Slf4j
@RequiredArgsConstructor
public class EnrollmentApiController{
    private final EnrollmentManagementService enrollmentManagementService;

    @PostMapping("")
    @ApiResponse(responseCode = "201", description = "수강 신청 등록 성공")
    @ApiResponse(responseCode = "400", description = "잘못된 형식의 데이터입니다. 요청 데이터를 확인해주세요.")
    @Operation(summary = "수강 신청 등록 API", description = "수강 신청 등록")
    public ResponseEntity<ResponseRoot<Object>> createEnrollment(
            @RequestParam Long courseId,
            @AuthenticationPrincipal CustomUserDetails userDetails
            ){
        log.debug("수강 신청 API 요청 데이터. courseId = {}", courseId);
        log.debug("수강 신청 API 요청 사용자. courseId = {}", userDetails);

        enrollmentManagementService.enroll(courseId, userDetails.getUsername());
        return CommonResponseBuilder.success("수강 신청 등록에 성공하였습니다.",
                null);
    }

    @DeleteMapping("")
    @ApiResponse(responseCode = "200", description = "수강 신청 삭제 성공")
    @ApiResponse(responseCode = "400", description = "잘못된 형식의 데이터입니다. 요청 데이터를 확인해주세요.")
    @Operation(summary = "수강 신청 삭제 API", description = "수강 신청 삭제")
    public ResponseEntity<ResponseRoot<Object>> deleteEnrollment(
            @RequestParam Long courseId,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ){
        log.debug("수강 신청 취소 API 요청 데이터. courseId = {}", courseId);
        log.debug("수강 신청 취소 API 요청 사용자. courseId = {}", userDetails);

        enrollmentManagementService.cancle(courseId, userDetails.getUsername());
        return CommonResponseBuilder.success("수강 신청 삭제에 성공하였습니다.",
                null);
    }

}