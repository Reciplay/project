package com.e104.reciplay.admin.controller;

import com.e104.reciplay.admin.dto.request.ApprovalInfo;
import com.e104.reciplay.admin.dto.response.*;
import com.e104.reciplay.common.response.dto.ResponseRoot;
import com.e104.reciplay.common.response.util.CommonResponseBuilder;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "관리자 페이지 API", description = "관리자 페이지")
@RestController
@RequestMapping("/api/v1/course/admin")
@Slf4j

public class AdminApiController{
    @GetMapping("/instructor/summary")
    @Operation(summary = "강사 요약 정보 리스트 조회 API", description = "강사 요약 정보 신청 리스트 조회")
    public ResponseEntity<ResponseRoot<List<AdminInstructorSummary>>> getInstructorSummaries(
            @RequestParam Integer isApprove
    ) {

        return CommonResponseBuilder.success("강사 요약 정보 리스트 조회에 성공하였습니다.",
                List.of(new AdminInstructorSummary()));
    }

    @GetMapping("/instructor")
    @Operation(summary = "강사 상세 정보 조회 API", description = "강사 상세 정보 조회")
    public ResponseEntity<ResponseRoot<AdminInstructorDetail>> getInstructorDetail(
            @RequestParam Long instructorId
    ){

        return CommonResponseBuilder.success("강사 상세 정보 조회에 성공하였습니다.", new AdminInstructorDetail());
    }

    @PutMapping("/instructor")
    @Operation(summary = "강사 상태(등록 여부) 변경 및 알림 처리 API", description = "강사 상태(등록 여부) 변경 및 알림 처리 API")
    public ResponseEntity<ResponseRoot<Object>> updateInstructorStatus(
            @RequestBody ApprovalInfo approvalInfo
    ){

        return CommonResponseBuilder.success("강사 상태(등록 여부) 변경에 성공하였습니다.", null);
    }

    @GetMapping("/course/summary")
    @Operation(summary = "강좌 요약 정보 리스트 조회 API", description = "강좌 요약 정보 신청 리스트 조회")
    public ResponseEntity<ResponseRoot<List<AdminCourseSummary>>> getCourseSummaries(
            @RequestParam Integer isApprove
    ) {

        return CommonResponseBuilder.success("강좌 요약 정보 리스트 조회에 성공하였습니다.",
                List.of(new AdminCourseSummary()));
    }

    @GetMapping("/course")
    @Operation(summary = "강좌 상세 정보 조회 API", description = "강좌 상세 정보 조회")
    public ResponseEntity<ResponseRoot<AdminCourseDetail>> getCourseDetail(
            @RequestParam Long courseId
    ){

        return CommonResponseBuilder.success("강좌 상세 정보 조회에 성공하였습니다.", new AdminCourseDetail());
    }

    @PutMapping("/course")
    @Operation(summary = "강좌 상태(등록 여부) 변경 API", description = "강좌 상태(등록 여부) 정보 조회")
    public ResponseEntity<ResponseRoot<Object>> updateCourseStatus(
            @RequestBody ApprovalInfo approvalInfo
    ){

        return CommonResponseBuilder.success("강좌 상태(등록 여부) 변경에 성공하였습니다.", null);
    }

    @GetMapping("/user/summary")
    @Operation(summary = "일반 회원 요약 정보 리스트 조회 API", description = "일반 회원 요약 정보 신청 리스트 조회")
    public ResponseEntity<ResponseRoot<List<AdminUserSummary>>> getUserSummaries(
    ) {

        return CommonResponseBuilder.success("일반 회원 요약 정보 리스트 조회에 성공하였습니다.",
                List.of(new AdminUserSummary()));
    }

    @GetMapping("/user")
    @Operation(summary = "일반 회원 상세 정보 조회 API", description = "일반 회원 상세 정보 조회")
    public ResponseEntity<ResponseRoot<AdminUserDetail>> getUserDetail(
    ){

        return CommonResponseBuilder.success("일반 회원 상세 정보 조회에 성공하였습니다.", new AdminUserDetail());
    }

    @DeleteMapping("/user")
    @Operation(summary = "회원 탈퇴 API", description = "회원 탈퇴")
    public ResponseEntity<ResponseRoot<Object>> DeleteUser(
            @RequestParam Long userId
    ){

        return CommonResponseBuilder.success("회원 탈퇴에 성공하였습니다.", null);
    }
}